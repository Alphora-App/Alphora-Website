import { useState } from "react";

// Prefer a build-time VITE_WAITLIST_ENDPOINT, but allow a runtime override so the
// deployed HTML can set window.__WAITLIST_ENDPOINT or a meta tag without rebuilding.
const BUILD_WAITLIST_ENDPOINT = ((import.meta as any).env?.VITE_WAITLIST_ENDPOINT as string) || "";

function resolveWaitlistEndpoint(): string {
  if (BUILD_WAITLIST_ENDPOINT) return BUILD_WAITLIST_ENDPOINT;
  try {
    if (typeof window !== "undefined" && (window as any).__WAITLIST_ENDPOINT) return (window as any).__WAITLIST_ENDPOINT as string;
    if (typeof document !== "undefined") {
      const m = document.querySelector('meta[name="waitlist-endpoint"]') as HTMLMetaElement | null;
      if (m && m.content) return m.content;
    }
  } catch (e) {
    // ignore
  }
  return "";
}

export default function SiteFooter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const endpoint = resolveWaitlistEndpoint();
    if (!endpoint) {
      setStatus("error");
      setMessage("Server not configured — VITE_WAITLIST_ENDPOINT is missing. Please contact the site admin.");
      return;
    }
  // Save a direct reference to the form element before any awaits.
  const formEl = e.currentTarget as HTMLFormElement;
  const form = new FormData(formEl);
  const email = (form.get("email") || "").toString().trim().toLowerCase();
  const honeypot = (form.get("_hp") || "").toString();
  form.set("source", "footer");

    // local duplicate check
    try {
      const seenRaw = localStorage.getItem("alphora_waitlist_emails");
      const seen: string[] = seenRaw ? JSON.parse(seenRaw) : [];
      if (seen.includes(email)) {
        setStatus("error");
        setMessage("You've already submitted that email.");
        return;
      }
    } catch (err) {}
    try {
      // Send FormData to avoid preflight; function will parse multipart/form-data.
      const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: form });
      if (res.ok) {
        setStatus("success");
        setMessage(`Thanks — we'll be in touch! We'll email you at ${email}.`);
        try {
          formEl.reset();
        } catch (err) {
          console.warn("Footer form reset failed:", err);
        }
        try {
          const seenRaw = localStorage.getItem("alphora_waitlist_emails");
          const seen: string[] = seenRaw ? JSON.parse(seenRaw) : [];
          seen.push(email);
          localStorage.setItem("alphora_waitlist_emails", JSON.stringify(Array.from(new Set(seen))));
        } catch (err) {}
      } else setStatus("error");
    } catch (err) {
      console.error("Footer waitlist submission failed:", err);
      setStatus("error");
      const short = err && err instanceof Error ? err.message : String(err || "");
      setMessage(
        `Network error — please try again later.${short ? ` (${short})` : ""} The waitlist endpoint may be protected (401/CORS). Make the function public or proxy requests through a server that adds an Authorization header.`
      );
    }
  }

  return (
    <footer className="mt-24 py-12 text-sm text-brand-50/80 border-t border-white/8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 items-start">
        <div>
          <img src="/alphora-logo-official.svg" alt="Alphora" className="w-28 h-28 object-contain select-none" />
          <p className="mt-2 text-brand-50/70">Alphora — learn investing through practice and rewards.</p>
        </div>

        <div>
          <h4 className="font-semibold text-brand-50 mb-3">Get early access</h4>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              name="email"
              type="email"
              placeholder="you@domain.com"
              onChange={() => {
                if (status !== "loading") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-brand-50 placeholder:text-brand-50/40 focus:outline-none"
            />
            <button type="submit" className="px-4 rounded-lg bg-gradient-to-r from-violet-600/70 to-pink-500/70 text-white shadow-glow interactive" disabled={status === "loading" || status === "success"}>{status === "loading" ? "Sending..." : "Join"}</button>
          </form>
          {status === "success" && message && <div className="mt-2 text-green-400" role="status" aria-live="polite">{message}</div>}
          {status === "error" && message && <div className="mt-2 text-red-400" role="alert" aria-live="assertive">{message}</div>}
        </div>

        <div>
          <h4 className="font-semibold text-brand-50 mb-3">Follow</h4>
          <div className="flex gap-3">
            <a href="#" className="interactive text-brand-50/90">Twitter</a>
            <a href="#" className="interactive text-brand-50/90">LinkedIn</a>
            <a href="#" className="interactive text-brand-50/90">GitHub</a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-brand-50/60">© {new Date().getFullYear()} Alphora • All rights reserved</div>
    </footer>
  );
}
