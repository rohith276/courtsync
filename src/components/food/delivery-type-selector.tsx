"use client"

import { Store, ShoppingBag, Truck } from "lucide-react"

const deliveryTypes = [
  { key: "DINE_IN", label: "Dine-in", icon: Store },
  { key: "TAKEAWAY", label: "Takeaway", icon: ShoppingBag },
  { key: "DELIVERY", label: "Delivery", icon: Truck },
] as const

interface DeliveryTypeSelectorProps {
  selected: string
  onSelect: (type: string) => void
}

export function DeliveryTypeSelector({ selected, onSelect }: DeliveryTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {deliveryTypes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex-1 flex justify-center items-center gap-1.5 px-2 py-2.5 text-xs font-semibold uppercase tracking-widest border transition-all whitespace-nowrap ${
            selected === key
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
