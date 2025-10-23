import { useState } from "react";

// Replace YOUR_FORM_ID with the Formspree form ID you get from https://formspree.io
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myznadvn";

export default function CTA() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    // Save a direct reference to the form element before any awaits.
    // React may null out the synthetic event after async boundaries, so
    // using `e.currentTarget` after an await can be null.
    const formEl = e.currentTarget as HTMLFormElement;
    const form = new FormData(formEl);
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
    } catch (err) {
      // ignore localStorage parse errors
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });
      if (res.ok) {
        setStatus("success");
        setMessage(`Thanks — you're on the list! We'll email you at ${email}.`);
        // Use the saved form element reference to reset safely
        try {
          formEl.reset();
        } catch (err) {
          // If reset fails for any reason, don't crash the flow; just log.
          console.warn("Form reset failed:", err);
        }
        // record email locally to prevent duplicates
        try {
          const seenRaw = localStorage.getItem("alphora_waitlist_emails");
          const seen: string[] = seenRaw ? JSON.parse(seenRaw) : [];
          seen.push(email);
          localStorage.setItem("alphora_waitlist_emails", JSON.stringify(Array.from(new Set(seen))));
        } catch (err) {}
      } else {
        let bodyText = await res.text();
        try {
          const json = JSON.parse(bodyText);
          if (json && json.errors && Array.isArray(json.errors) && json.errors[0]) bodyText = json.errors[0].message || bodyText;
        } catch (err) {}
        setStatus("error");
        setMessage(bodyText || "Something went wrong. Try again later.");
      }
    } catch (err) {
      // surface error to console for debugging and show a helpful message to the user
      console.error("Waitlist submission failed:", err);
      setStatus("error");
      const short = err && err instanceof Error ? err.message : String(err || "");
      setMessage(`Network error — please try again later.${short ? ` (${short})` : ""}`);
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
              onChange={() => {
                // Clear success/error messages when the user edits the input so the
                // form can be reused for another submission. Don't clear while loading.
                if (status !== "loading") {
                  setStatus("idle");
                  setMessage(null);
                }
              }}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:outline-none focus:border-brand-400/50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 rounded-xl bg-gradient-to-r from-violet-600/60 to-pink-500/60 border border-violet-400/40 text-brand-50 hover:from-violet-600/80 hover:to-pink-500/80 transition-all shadow-glow"
            >
              {status === "loading" ? "Sending..." : "Join"}
            </button>
          </form>

          {status === "success" && message && (
            <div className="mt-4 text-green-400" role="status" aria-live="polite">
              {message}
            </div>
          )}
          {status === "error" && message && (
            <div className="mt-4 text-red-400" role="alert" aria-live="assertive">
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
