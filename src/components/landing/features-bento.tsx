"use client"

import { motion } from "framer-motion"
import { Clock, Wifi, Zap, Wind, ChefHat, Truck, QrCode, Leaf } from "lucide-react"

const courtFeatures = [
  { icon: <Clock className="h-5 w-5" />, title: "Book by the Hour", desc: "Flexible hourly slots, 6 AM to midnight." },
  { icon: <Wifi className="h-5 w-5" />, title: "Live Availability", desc: "Real-time court status — no double bookings." },
  { icon: <Zap className="h-5 w-5" />, title: "Smart Lighting", desc: "Professional LED court lighting, adjustable." },
  { icon: <Wind className="h-5 w-5" />, title: "Climate Controlled", desc: "Air-conditioned halls, year-round comfort." },
]

const dineFeatures = [
  { icon: <ChefHat className="h-5 w-5" />, title: "Full Kitchen", desc: "From smoothies to full course meals." },
  { icon: <Truck className="h-5 w-5" />, title: "Courtside Delivery", desc: "Order from the court, delivered to you." },
  { icon: <QrCode className="h-5 w-5" />, title: "QR Ordering", desc: "Scan, order, pay — no waiting in line." },
  { icon: <Leaf className="h-5 w-5" />, title: "Healthy Options", desc: "Protein bowls, salads, and workout meals." },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } as const,
}

export function FeaturesBento() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
            What we offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
            Two experiences. One destination.
          </h2>
        </div>

        {/* Two equal columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-px bg-border">

          {/* PLAY column */}
          <div className="bg-background p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">01</span>
              <h3 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-3">Play</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Badminton courts and cricket pitches built for serious players and weekend warriors alike.
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              {courtFeatures.map((f) => (
                <motion.div key={f.title} variants={itemVariants} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center shrink-0 rounded-sm transition-colors group-hover:bg-accent">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* DINE column */}
          <div className="bg-background p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">02</span>
              <h3 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-3">Dine</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                A full-service café and restaurant — not just snacks. Dine in, take away, or get it delivered courtside.
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              {dineFeatures.map((f) => (
                <motion.div key={f.title} variants={itemVariants} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-accent text-white flex items-center justify-center shrink-0 rounded-sm transition-colors group-hover:bg-foreground">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
