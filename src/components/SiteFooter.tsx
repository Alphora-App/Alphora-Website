export default function SiteFooter() {
  return (
    <footer className="mt-24 py-8 text-center text-sm text-brand-50/60 border-t border-white/10">
      © {new Date().getFullYear()} Alphora • All rights reserved
    </footer>
  );
}
