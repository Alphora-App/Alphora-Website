// Use an explicit deno.land std import so the bundler can resolve the module.
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";

// Helper to read the first available env var from a list of possible names.
function getEnv(...names: string[]) {
  for (const n of names) {
    let v = "";
    const g = globalThis as any;
    // prefer Deno env when available via globalThis to avoid TS 'Deno' name errors
    if (g.Deno && g.Deno.env && typeof g.Deno.env.get === "function") {
      v = g.Deno.env.get(n) || "";
    } else if (g.process && g.process.env) {
      v = g.process.env[n] || "";
    } else if (g.__env) {
      v = g.__env[n] || "";
    }
    if (v) return v;
  }
  return "";
}

function findEnvName(...names: string[]) {
  const g = globalThis as any;
  for (const n of names) {
    if (g.Deno && g.Deno.env && typeof g.Deno.env.get === "function") {
      if (g.Deno.env.get(n)) return n;
    } else if (g.process && g.process.env) {
      if (g.process.env[n]) return n;
    } else if (g.__env) {
      if (g.__env[n]) return n;
    }
  }
  return null;
}

// Read SUPABASE_* variables if present, but also fall back to a variety of alternate names
// (SERVICE_ROLE / PROJECT_URL / DATABASE_URL, etc.) so deployers that forbid certain prefixes
// can still provide secrets under another name.
const SUPABASE_URL = getEnv(
  "SUPABASE_URL",
  "SUPABASE_SERVICE_URL",
  "PROJECT_URL",
  "URL",
  "WAITLIST_SUPABASE_URL",
  "DATABASE_URL",
  "DB_URL",
  "SUPABASE_DB_URL",
  "PG_URL"
);

// Service role key: try many common names (with and without SUPABASE_ prefix)
const SUPABASE_SERVICE_ROLE = getEnv(
  "SUPABASE_SERVICE_ROLE",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SERVICE_KEY",
  "SERVICE_ROLE",
  "SERVICE_ROLE_KEY",
  "SERVICE_KEY",
  "WAITLIST_SERVICE_ROLE",
  "WAITLIST_SERVICE_KEY"
);

const RECAPTCHA_SECRET = getEnv("RECAPTCHA_SECRET", "WAITLIST_RECAPTCHA_SECRET", "RECAPTCHA"); // optional

try {
  const urlName = findEnvName(
    "SUPABASE_URL",
    "SUPABASE_SERVICE_URL",
    "PROJECT_URL",
    "URL",
    "WAITLIST_SUPABASE_URL",
    "DATABASE_URL",
    "DB_URL",
    "SUPABASE_DB_URL",
    "PG_URL"
  );
  const keyName = findEnvName(
    "SUPABASE_SERVICE_ROLE",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SERVICE_KEY",
    "SERVICE_ROLE",
    "SERVICE_ROLE_KEY",
    "SERVICE_KEY",
    "WAITLIST_SERVICE_ROLE",
    "WAITLIST_SERVICE_KEY"
  );
  console.log(`Resolved env names: SUPABASE_URL -> ${urlName ?? "(none)"}, SERVICE_ROLE -> ${keyName ?? "(none)"}`);
} catch (e) {}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error("Missing required environment variables. Need SUPABASE_URL and SUPABASE_SERVICE_ROLE[_KEY] to be set in function secrets.");
}

function getSupabaseClient() {
  const urlName = findEnvName(
    "SUPABASE_URL",
    "SUPABASE_SERVICE_URL",
    "PROJECT_URL",
    "URL",
    "WAITLIST_SUPABASE_URL",
    "DATABASE_URL",
    "DB_URL",
    "SUPABASE_DB_URL",
    "PG_URL"
  );
  const keyName = findEnvName(
    "SUPABASE_SERVICE_ROLE",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SERVICE_KEY",
    "SERVICE_ROLE",
    "SERVICE_ROLE_KEY",
    "SERVICE_KEY",
    "WAITLIST_SERVICE_ROLE",
    "WAITLIST_SERVICE_KEY"
  );
  console.log(`Resolved env names: SUPABASE_URL -> ${urlName ?? "(none)"}, SERVICE_ROLE -> ${keyName ?? "(none)"}`);

  const url = SUPABASE_URL;
  const key = SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variables");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req: Request) => {
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

    // Create supabase client for this request (and log which env names were found)
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (err: any) {
      console.error("Supabase client creation failed:", err?.message ?? String(err));
      return new Response("Server configuration error", { status: 500 });
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
