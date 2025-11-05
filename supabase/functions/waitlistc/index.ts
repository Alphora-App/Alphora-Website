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

// Return the first env name that exists (without returning the value) so we can log which
// secret name the runtime provided. This avoids printing secret values to logs.
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

// Log which secret names we resolved (do NOT log secret values). This helps debugging 401s.
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
} catch (e) {
  // ignore logging errors
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error("Missing required environment variables. Need SUPABASE_URL and SUPABASE_SERVICE_ROLE[_KEY] to be set in function secrets.");
}

// Don't create the Supabase client at module evaluation time — create it per-request so we
// can log which env names are present and avoid an early hard crash when secrets are missing.
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
    // CORS support: respond to preflight and include CORS headers on all responses.
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Support a debug GET that returns which env NAMES were resolved (no secret values).
    const url = new URL(req.url);
    if (req.method === "GET" && url.searchParams.get("debug") === "1") {
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
      return new Response(JSON.stringify({ resolved: { SUPABASE_URL: urlName ?? null, SERVICE_ROLE: keyName ?? null } }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
    // Accept either JSON or form-encoded bodies so browsers can POST without preflight
    // if desired (some hosts reject requests before the function runs when protected).
    let body: any = {};
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      body = await req.json().catch(() => ({}));
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // parse urlencoded form data
      const text = await req.text().catch(() => "");
      try {
        const params = new URLSearchParams(text || "");
        for (const [k, v] of params.entries()) body[k] = v;
      } catch (e) {
        // ignore
      }
    } else if (contentType.includes("multipart/form-data")) {
      // parse multipart form data (FormData)
      try {
        const fd = await (req as any).formData();
        if (fd) {
          for (const [k, v] of fd.entries()) {
            if (typeof v === "string") body[k] = v;
            else if (v && typeof v === "object" && typeof v.text === "function") {
              // file-like
              try {
                body[k] = await v.text();
              } catch (e) {
                body[k] = String(v);
              }
            } else {
              body[k] = String(v);
            }
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    } else {
      // fallback: try text -> urlencoded
      const text = await req.text().catch(() => "");
      try {
        const params = new URLSearchParams(text || "");
        for (const [k, v] of params.entries()) body[k] = v;
      } catch (e) {
        // leave body empty
      }
    }

    const email = (body.email || "").toString().trim().toLowerCase();
    const honeypot = (body._hp || "").toString();
    const token = (body.token || "").toString();
    const source = (body.source || "website").toString();

  if (!email || !isValidEmail(email)) return new Response("Invalid email", { status: 400, headers: corsHeaders });
  if (honeypot && honeypot.length > 0) return new Response("Bot detected", { status: 400, headers: corsHeaders });

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
      return new Response("Server configuration error", { status: 500, headers: corsHeaders });
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
  if (recent && (recent as any).length > 0) return new Response("Rate limit", { status: 429, headers: corsHeaders });

    const { error: insertErr } = await supabase.from("waitlist_emails").insert([{ email, ip, source }]);
    if (insertErr) {
      // duplicate insert
      if (insertErr.code && insertErr.code.toString().includes("23505")) {
        return new Response(JSON.stringify({ ok: true, message: "Already subscribed" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      console.error("insert error", insertErr);
      return new Response("Insert failed", { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
});
