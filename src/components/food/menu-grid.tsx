"use client"

import { MenuItemCard } from "./menu-item-card"

interface MenuGridProps {
  items: any[]
}

export function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">
          No items found in this category.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
