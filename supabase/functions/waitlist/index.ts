import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// Read SUPABASE_* variables if present, but also fall back to allowed names some deployers accept
// (SERVICE_ROLE / PROJECT_URL) so CI can set non-SUPABASE_* secrets when needed.
const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL") || Deno.env.get("SUPABASE_SERVICE_URL") || Deno.env.get("PROJECT_URL") || Deno.env.get("URL") || Deno.env.get("WAITLIST_SUPABASE_URL") || "";
// Service role key: prefer SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY, then fall back to SERVICE_ROLE
const SUPABASE_SERVICE_ROLE =
  Deno.env.get("SUPABASE_SERVICE_ROLE") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE") || Deno.env.get("WAITLIST_SERVICE_ROLE") || "";
const RECAPTCHA_SECRET = Deno.env.get("RECAPTCHA_SECRET") || Deno.env.get("WAITLIST_RECAPTCHA_SECRET") || ""; // optional

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error("Missing required environment variables. Need SUPABASE_URL and SUPABASE_SERVICE_ROLE[_KEY] to be set in function secrets.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toString().trim().toLowerCase();
    const honeypot = (body._hp || "").toString();
    const token = (body.token || "").toString();
    const source = (body.source || "website").toString();

    if (!email || !isValidEmail(email)) return new Response("Invalid email", { status: 400 });
    if (honeypot && honeypot.length > 0) return new Response("Bot detected", { status: 400 });

    // Optional captcha verification
    if (RECAPTCHA_SECRET) {
      if (!token) return new Response("Missing captcha", { status: 400 });
      const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
      });
      const vjson = await verify.json().catch(() => ({}));
      if (!vjson.success) return new Response("Captcha failed", { status: 400 });
    }

    // Simple rate-limit: has this IP inserted in the last 30s?
    const rateWindowSeconds = 30;
    const since = new Date(Date.now() - rateWindowSeconds * 1000).toISOString();
    const { data: recent, error: rErr } = await supabase
      .from("waitlist_emails")
      .select("id")
      .eq("ip", ip)
      .gt("created_at", since)
      .limit(1);
    if (rErr) console.warn("rate check error", rErr);
    if (recent && (recent as any).length > 0) return new Response("Rate limit", { status: 429 });

    const { error: insertErr } = await supabase.from("waitlist_emails").insert([{ email, ip, source }]);
    if (insertErr) {
      // duplicate insert
      if (insertErr.code && insertErr.code.toString().includes("23505")) {
        return new Response(JSON.stringify({ ok: true, message: "Already subscribed" }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      console.error("insert error", insertErr);
      return new Response("Insert failed", { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
});
