"use client"

import { useState, useEffect } from "react"
import { DeliveryTypeSelector } from "@/components/food/delivery-type-selector"
import { CategoryBar } from "@/components/food/category-bar"
import { MenuGrid } from "@/components/food/menu-grid"
import { CartBar } from "@/components/food/cart-bar"
import { CartDrawer } from "@/components/food/cart-drawer"
import { getMenuItems } from "@/actions/food"
import { MenuItemCard } from "@/components/food/menu-item-card"
import { useSearchParams } from "next/navigation"

interface FoodClientProps {
  initialItems: any[]
  categories: string[]
  recommendedItems: any[]
  rewardPoints: number
}

export function FoodClient({ initialItems, categories, recommendedItems, rewardPoints }: FoodClientProps) {
  const searchParams = useSearchParams()
  const [deliveryType, setDeliveryType] = useState(
    searchParams.get("mode") === "takeaway" ? "TAKEAWAY"
    : searchParams.get("mode") === "delivery" ? "DELIVERY"
    : "DINE_IN"
  )
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [items, setItems] = useState<any[]>(initialItems)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch items when category changes
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true)
      const data = await getMenuItems(selectedCategory)
      setItems(data)
      setIsLoading(false)
    }
    // Only fetch if not ALL, otherwise use initialItems which is already ALL
    if (selectedCategory === "ALL") {
      setItems(initialItems)
    } else {
      fetchCategory()
    }
  }, [selectedCategory, initialItems])

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">Café & Restaurant</h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Fresh, chef-prepared meals delivered to your table or court.
            </p>
          </div>
          
          <DeliveryTypeSelector selected={deliveryType} onSelect={setDeliveryType} />
        </div>

        {/* Recommended / Popular Section */}
        {selectedCategory === "ALL" && recommendedItems.length > 0 && (
          <div className="mb-12 pb-12 border-b border-border">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold font-heading">Popular Near You</h2>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-sm">Best Sellers</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {recommendedItems.map(item => (
                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Navigation */}
        <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0">
          <CategoryBar 
            categories={categories} 
            selected={selectedCategory} 
            onSelect={setSelectedCategory} 
          />
        </div>

        {/* Menu Grid */}
        <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          <MenuGrid items={items} />
        </div>
      </div>

      <CartBar onOpenDrawer={() => setIsCartOpen(true)} />
      
      <CartDrawer 
        open={isCartOpen} 
        onOpenChange={setIsCartOpen} 
        deliveryType={deliveryType}
        rewardPoints={rewardPoints}
      />
    </>
  )
}
