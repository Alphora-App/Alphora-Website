import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function Section({ id, title, children }:{ id:string, title:string, children: ReactNode }){
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-14">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .3 }}
        transition={{ duration: .6 }}
      >
        {title}
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .2 }}
        transition={{ duration: .6, delay: .1 }}
      >
        {children}
      </motion.div>
    </section>
  )
}
