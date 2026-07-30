"use client"

import { useCart } from "@/context/cart-context"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CartBarProps {
  onOpenDrawer: () => void
}

export function CartBar({ onOpenDrawer }: CartBarProps) {
  const { itemCount, subtotal } = useCart()

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 pointer-events-none"
        >
          <div className="container mx-auto px-0 md:px-4 max-w-5xl">
            <button
              onClick={onOpenDrawer}
              className="w-full bg-accent text-white shadow-xl pointer-events-auto flex items-center justify-between p-4 px-6 transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm uppercase tracking-widest leading-none mb-1">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </p>
                  <p className="font-mono font-bold text-lg leading-none">
                    ₹{subtotal.toFixed(2)} <span className="text-xs font-sans font-normal opacity-80">+ taxes</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
                View Cart <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
