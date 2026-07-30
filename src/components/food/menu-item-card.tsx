"use client"

import { Star, Flame } from "lucide-react"
import { useCart, CartItem } from "@/context/cart-context"
import { QuantityControl } from "./quantity-control"

interface MenuItemCardProps {
  item: any
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart()

  const cartItem = items.find((i) => i.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
    })
  }

  return (
    <div className="flex flex-col border border-border bg-card overflow-hidden group">
      {item.imageUrl && (
        <div className="aspect-video w-full bg-muted overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                item.isVeg ? "border-green-600" : "border-red-600"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  item.isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </div>
            {item.isSpicy && <Flame className="h-4 w-4 text-accent" />}
          </div>
          {item.ratingCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-lime-700 dark:text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded-sm">
              <Star className="h-3 w-3 fill-current" />
              {item.rating.toFixed(1)}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold font-heading mb-1">{item.name}</h3>
        <p className="text-xl font-mono text-muted-foreground mb-3">
          ₹{item.price}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {item.preparationTime} MIN
          </span>
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrement={() => updateQuantity(item.id, quantity + 1)}
              onDecrement={() => updateQuantity(item.id, quantity - 1)}
            />
          ) : (
            <button
              onClick={handleAdd}
              className="px-6 py-2 text-xs font-semibold uppercase tracking-widest border border-accent text-accent hover:bg-accent/5 transition-colors"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
