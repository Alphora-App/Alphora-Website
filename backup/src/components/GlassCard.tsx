import { motion } from 'framer-motion'

export default function GlassCard({title, body}:{title:string, body:string}){
  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.01 }}
      className="p-5 rounded-2xl glass min-h-[140px]"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-slate-300 text-sm mt-2">{body}</p>
    </motion.div>
  )
}
