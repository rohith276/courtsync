"use client"

import { Minus, Plus } from "lucide-react"

interface QuantityControlProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export function QuantityControl({ quantity, onIncrement, onDecrement }: QuantityControlProps) {
  return (
    <div className="flex items-center border border-accent bg-accent/5">
      <button
        onClick={onDecrement}
        className="w-8 h-8 flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-accent">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
