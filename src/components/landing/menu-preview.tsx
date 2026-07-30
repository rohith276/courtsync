"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const menuHighlights = [
  {
    category: "Pre-Game",
    items: [
      { name: "Energy Smoothie Bowl", price: "₹249", tag: "Popular" },
      { name: "Banana Protein Shake", price: "₹199", tag: null },
      { name: "Avocado Toast", price: "₹279", tag: "New" },
    ],
  },
  {
    category: "Post-Game",
    items: [
      { name: "Grilled Chicken Bowl", price: "₹349", tag: "Best Seller" },
      { name: "Paneer Tikka Wrap", price: "₹289", tag: null },
      { name: "Recovery Juice", price: "₹179", tag: null },
    ],
  },
  {
    category: "All Day",
    items: [
      { name: "Farm Fresh Salad", price: "₹229", tag: null },
      { name: "Artisan Coffee", price: "₹149", tag: "Popular" },
      { name: "Wood-Fired Pizza", price: "₹449", tag: "Chef's Pick" },
    ],
  },
]

export function MenuPreview() {
  return (
    <section id="dine" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Left — Header */}
          <div className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              Our Menu
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-6">
              Fuel your game.<br/>
              Feed your soul.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Whether you&apos;re here to play or just to eat, our kitchen serves fresh, chef-prepared meals all day. No reheated snack-bar food — real food for real appetites.
            </p>
            <Button asChild variant="outline" className="rounded-none uppercase tracking-widest text-xs font-semibold h-12 px-8 group">
              <Link href="/food">
                Full Menu
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Right — Menu Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuHighlights.map((section, si) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: si * 0.1 }}
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-6 pb-3 border-b border-border">
                  {section.category}
                </h3>
                <ul className="space-y-5">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href="/food"
                        className="group flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                            {item.name}
                          </span>
                          {item.tag && (
                            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-sm">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">{item.price}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
