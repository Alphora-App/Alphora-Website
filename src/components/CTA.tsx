import { useState } from "react";

// Replace YOUR_FORM_ID with the Formspree form ID you get from https://formspree.io
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myznadvn";

export default function CTA() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });
      if (res.ok) {
        setStatus("success");
        (e.currentTarget as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <section id="cta" className="mt-24 mb-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="glass rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-brand-50/90">Get early access</h3>
          <p className="mt-2 text-brand-50/70">Join the waitlist to be notified when we launch.</p>
          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="you@domain.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:outline-none focus:border-brand-400/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 rounded-xl bg-gradient-to-r from-violet-600/60 to-pink-500/60 border border-violet-400/40 text-brand-50 hover:from-violet-600/80 hover:to-pink-500/80 transition-all shadow-glow"
            >
              {status === "loading" ? "Sending..." : "Join"}
            </button>
          </form>

          {status === "success" && <div className="mt-4 text-green-400">Thanks — you're on the list!</div>}
          {status === "error" && <div className="mt-4 text-red-400">Something went wrong. Try again later.</div>}
        </div>
      </div>
    </section>
  );
}
