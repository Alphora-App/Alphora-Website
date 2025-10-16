import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Row = { ticker:string; name:string; price:number; change:number }

const SEED: Row[] = [
  { ticker:'AAPL', name:'Apple Inc.', price:224.12, change:+1.2 },
  { ticker:'MSFT', name:'Microsoft', price:451.02, change:-0.4 },
  { ticker:'NVDA', name:'NVIDIA', price:113.88, change:+2.9 },
  { ticker:'VOO',  name:'Vanguard S&P 500 ETF', price:492.13, change:+0.3 },
]

export default function WatchlistDemo(){
  const [rows, setRows] = useState<Row[]>(()=>{
    const saved = localStorage.getItem('wl'); 
    return saved ? JSON.parse(saved) as Row[] : SEED
  })
  const [filter, setFilter] = useState('')

  function add(t:string){
    const T = t.toUpperCase().trim()
    if(!T) return
    if(rows.some(r=>r.ticker===T)) return alert('Already added')
    const next = [...rows, { ticker:T, name: `${T} (demo)`, price: 100+Math.random()*50, change:(Math.random()*4-2)}]
    setRows(next); localStorage.setItem('wl', JSON.stringify(next))
  }
  function remove(t:string){
    const next = rows.filter(r=>r.ticker!==t)
    setRows(next); localStorage.setItem('wl', JSON.stringify(next))
  }

  const shown = useMemo(()=> rows.filter(r => 
    r.ticker.includes(filter.toUpperCase()) || r.name.toUpperCase().includes(filter.toUpperCase())
  ), [rows, filter])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input placeholder="Add ticker (AAPL)" className="px-3 py-2 rounded-lg glass-dark w-40"
          onKeyDown={e=>{ if(e.key==='Enter'){ add((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value=''; } }} />
        <input placeholder="Filter…" className="px-3 py-2 rounded-lg glass-dark flex-1" value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>
      <motion.div 
        initial={{ opacity:0, y:20 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true, amount:.2 }}
        transition={{ duration:.6 }}
        className="rounded-xl overflow-hidden border border-white/10"
      >
        <div className="grid grid-cols-5 text-sm bg-white/5">
          <div className="px-3 py-2">Ticker</div>
          <div className="px-3 py-2">Name</div>
          <div className="px-3 py-2">Price</div>
          <div className="px-3 py-2">Δ %</div>
          <div className="px-3 py-2">Action</div>
        </div>
        {shown.map((r,i)=>(
          <div key={r.ticker} className="grid grid-cols-5 text-sm odd:bg-white/[.03]">
            <div className="px-3 py-2 font-semibold">{r.ticker}</div>
            <div className="px-3 py-2 opacity-90">{r.name}</div>
            <div className="px-3 py-2">${r.price.toFixed(2)}</div>
            <div className={"px-3 py-2 " + (r.change>=0 ? "text-emerald-400":"text-rose-400")}>
              {(r.change>=0?'+':'')+r.change.toFixed(1)}%
            </div>
            <div className="px-3 py-2"><button onClick={()=>remove(r.ticker)} className="px-2 py-1 rounded-md border border-white/10">Remove</button></div>
          </div>
        ))}
      </motion.div>
      <p className="text-xs text-slate-400">Demo data only. Wire to a market API later.</p>
    </div>
  )
}
