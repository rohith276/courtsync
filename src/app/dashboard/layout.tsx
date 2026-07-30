"use client"

import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { CalendarDays, ShoppingBag, Crown, Gift, Loader2 } from "lucide-react"

const tabs = [
  { name: "My Bookings", href: "/dashboard", icon: CalendarDays },
  { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Membership", href: "/dashboard/memberships", icon: Crown },
  { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthModalOpen, setAuthModalOpen, isLoaded } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const authPromptedRef = useRef(false)

  useEffect(() => {
    if (!isLoaded || user) return
    if (!authPromptedRef.current) {
      authPromptedRef.current = true
      setAuthModalOpen(true)
    }
  }, [isLoaded, user, setAuthModalOpen])

  useEffect(() => {
    if (!user && !isAuthModalOpen && authPromptedRef.current) {
      router.replace("/")
    }
  }, [user, isAuthModalOpen, router])

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-32 container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground">Manage your bookings, orders, and rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
                    isActive 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" />
                  {tab.name}
                </Link>
              )
            })}
          </div>

          <div className="md:col-span-3">
            <div className="bg-card border border-border p-6 md:p-8 min-h-[500px]">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
