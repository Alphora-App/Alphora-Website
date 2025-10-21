export default function CTA() {
  return (
    <section id="cta" className="mt-24 mb-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="glass rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-brand-50/90">Get early access</h3>
          <p className="mt-2 text-brand-50/70">Join the waitlist to be notified when we launch.</p>
          <form
            action="https://example.com/waitlist"  /* swap later for your backend/Formspree */
            method="POST"
            className="mt-6 flex gap-3"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@domain.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:outline-none focus:border-brand-400/50"
            />
            <button
              className="px-6 rounded-xl bg-gradient-to-r from-violet-600/60 to-pink-500/60 border border-violet-400/40 text-brand-50 hover:from-violet-600/80 hover:to-pink-500/80 transition-all shadow-glow"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
