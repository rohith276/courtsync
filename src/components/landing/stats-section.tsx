"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "10", label: "Courts & Pitches" },
  { value: "27+", label: "Menu Items" },
  { value: "6 AM–12 AM", label: "Open Daily" },
  { value: "10,000+", label: "Monthly Visitors" },
]

export function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-background/60">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
