"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-accent text-white">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6 leading-tight">
              Come for the game.<br/>
              Stay for the food.<br/>
              Or the other way around.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              Walk in, book online, or call us. Whether you are here to smash shuttlecocks or to grab a great meal — you are always welcome.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white hover:text-accent rounded-none uppercase tracking-widest text-xs font-semibold h-14 px-10 w-full md:w-auto group"
            >
              <Link href="/booking">
                Reserve a Court
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white hover:text-accent rounded-none uppercase tracking-widest text-xs font-semibold h-14 px-10 w-full md:w-auto group"
            >
              <Link href="/food?mode=dine-in">
                Order for Dine-in
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white hover:text-accent rounded-none uppercase tracking-widest text-xs font-semibold h-14 px-10 w-full md:w-auto group"
            >
              <Link href="/food">
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
