export default function SiteFooter() {
  return (
    <footer className="mt-24 py-12 text-sm text-brand-50/80 border-t border-white/8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 items-start">
        <div>
          <img src="/alphora-logo-official.svg" alt="Alphora" className="w-28 h-28 object-contain select-none" />
          <p className="mt-2 text-brand-50/70">Alphora — learn investing through practice and rewards.</p>
        </div>

        <div>
          <h4 className="font-semibold text-brand-50 mb-3">Get early access</h4>
          <form action="#" method="POST" className="flex gap-2">
            <input name="email" type="email" placeholder="you@domain.com" className="w-full rounded-lg bg-white/5 px-3 py-2 text-brand-50 placeholder:text-brand-50/40 focus:outline-none" />
            <button className="px-4 rounded-lg bg-gradient-to-r from-violet-600/70 to-pink-500/70 text-white shadow-glow interactive">Join</button>
          </form>
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
