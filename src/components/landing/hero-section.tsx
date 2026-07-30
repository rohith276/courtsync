"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Split Hero — two equal halves */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-screen">
        
        {/* LEFT — Play */}
        <div className="relative bg-foreground text-background flex flex-col justify-end p-8 md:p-16 min-h-[50vh] md:min-h-screen group overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
          }} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-lg"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-background/60 mb-6 block">
              Courts & Pitches
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[0.95] mb-6">
              Play at<br />
              your best.
            </h1>
            <p className="text-base md:text-lg text-background/70 max-w-md mb-8 leading-relaxed">
              8 badminton courts and 2 cricket pitches with real-time booking, smart lighting, and climate control. Walk in or reserve ahead.
            </p>
            <Button 
              asChild
              size="lg"
              variant="outline" 
              className="bg-transparent border-background/30 text-background hover:bg-background hover:text-foreground rounded-none uppercase tracking-widest text-xs font-semibold h-12 px-8 transition-all group/btn"
            >
              <Link href="/booking">
                Book a Court
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* RIGHT — Dine */}
        <div className="relative bg-accent text-white flex flex-col justify-end p-8 md:p-16 min-h-[50vh] md:min-h-screen group overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-lg"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-6 block">
              Café & Restaurant
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[0.95] mb-6">
              Dine in<br />
              style.
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-md mb-8 leading-relaxed">
              From post-game protein bowls to curated weekend brunches. A full kitchen, courtside delivery, and table reservations.
            </p>
            <Button 
              asChild
              size="lg"
              variant="outline" 
              className="bg-transparent border-white/30 text-white hover:bg-white hover:text-accent rounded-none uppercase tracking-widest text-xs font-semibold h-12 px-8 transition-all group/btn"
            >
              <Link href="/food">
                View Menu
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
