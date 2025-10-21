import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/myznadvn";

export default function SiteFooter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") || "").toString().trim().toLowerCase();

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
      const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: form });
      if (res.ok) {
        setStatus("success");
        setMessage(`Thanks — we'll be in touch! We'll email you at ${email}.`);
        (e.currentTarget as HTMLFormElement).reset();
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
      setMessage(err && err instanceof Error ? err.message : "Network error — please try again later.");
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
            <input name="email" type="email" placeholder="you@domain.com" className="w-full rounded-lg bg-white/5 px-3 py-2 text-brand-50 placeholder:text-brand-50/40 focus:outline-none" />
            <button className="px-4 rounded-lg bg-gradient-to-r from-violet-600/70 to-pink-500/70 text-white shadow-glow interactive" disabled={status === "loading" || status === "success"}>{status === "loading" ? "Sending..." : "Join"}</button>
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
