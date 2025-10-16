export default function FAQ(){
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <details className="rounded-xl glass p-4">
        <summary className="font-semibold">Is this financial advice?</summary>
        <p className="text-sm text-slate-300 mt-2">No, alphora is fully for educational purposes, not personalized financial advice.</p>
      </details>
      <details className="rounded-xl glass p-4">
        <summary className="font-semibold">Will it be free?</summary>
        <p className="text-sm text-slate-300 mt-2">There will be a generous free tier as well as a Premium tier which adds deeper lessons and practice.</p>
      </details>
      <details className="rounded-xl glass p-4">
        <summary className="font-semibold">Where does price data come from?</summary>
        <p className="text-sm text-slate-300 mt-2">This demo uses static numbers, but the full release app will call data from an API as real time as possible.</p>
      </details>
      <details className="rounded-xl glass p-4">
        <summary className="font-semibold">Is prior experience required? </summary>
        <p className="text-sm text-slate-300 mt-2">No, no experience is required! We cater to all skill levels from complete newbies to financial experts.</p>
      </details>
    </div>
  )
}
