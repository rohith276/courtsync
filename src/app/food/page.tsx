import { getMenuItems, getMenuCategories, getRecommendedItems, getRewardPoints } from "@/actions/food"
import { FoodClient } from "./client"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { CartProvider } from "@/context/cart-context"
import { Suspense } from "react"

export default async function FoodPage() {
  const allItems = await getMenuItems("ALL")
  const categories = await getMenuCategories()
  const recommendedItems = await getRecommendedItems()
  const rewardPoints = await getRewardPoints()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-muted/30 pt-24 pb-32">
        <CartProvider>
          <Suspense fallback={null}>
            <FoodClient 
              initialItems={allItems} 
              categories={categories} 
              recommendedItems={recommendedItems}
              rewardPoints={rewardPoints}
            />
          </Suspense>
        </CartProvider>
      </main>
      <Footer />
    </div>
  )
}
