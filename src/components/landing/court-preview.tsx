"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Users, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const timeSlots = [
  { time: "6:00 AM", courts: 10, status: "available" },
  { time: "7:00 AM", courts: 7, status: "available" },
  { time: "8:00 AM", courts: 3, status: "limited" },
  { time: "9:00 AM", courts: 0, status: "full" },
  { time: "10:00 AM", courts: 4, status: "available" },
  { time: "11:00 AM", courts: 8, status: "available" },
  { time: "12:00 PM", courts: 9, status: "available" },
  { time: "1:00 PM", courts: 5, status: "available" },
]

export function CourtPreview() {
  return (
    <section id="play" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Left — Header */}
          <div className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              Court & Pitch Booking
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-6">
              Your court is<br/>
              waiting.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              8 badminton courts and 2 cricket pitches. Book instantly, rent equipment, and play. Multi-hour slots, group bookings, and walk-ins welcome.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Badminton from ₹400/hr · Cricket from ₹800/hr</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Rackets, bats & gear available for rent</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Book multiple continuous hours at once</span>
              </div>
            </div>
            <Button asChild className="rounded-none uppercase tracking-widest text-xs font-semibold h-12 px-8 group">
              <Link href="/booking">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Right — Live availability preview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Table header */}
              <div className="grid grid-cols-3 gap-0 bg-muted px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                <span>Time Slot</span>
                <span className="text-center">Courts Free</span>
                <span className="text-right">Status</span>
              </div>

              {/* Rows */}
              {timeSlots.map((slot, i) => (
                <motion.div
                  key={slot.time}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="grid grid-cols-3 gap-0 px-6 py-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-mono text-sm font-medium">{slot.time}</span>
                  <span className="text-center text-sm text-muted-foreground">{slot.courts} / 10</span>
                  <span className="text-right">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm ${
                      slot.status === "available"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : slot.status === "limited"
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}>
                      {slot.status}
                    </span>
                  </span>
                </motion.div>
              ))}

              {/* Footer */}
              <div className="bg-muted px-6 py-3 text-xs text-muted-foreground text-center">
                Sample availability preview · Book for live slots
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
