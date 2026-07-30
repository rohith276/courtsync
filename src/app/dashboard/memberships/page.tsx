"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { getUserDashboardData } from "@/actions/dashboard"
import { format } from "date-fns"
import { Crown, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MembershipsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getUserDashboardData(user.email).then(res => {
        if (res.success) setData(res.data)
        setIsLoading(false)
      })
    }
  }, [user])

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
  }

  // Get active membership
  const memberships = data?.memberships || []
  const activeMembership = memberships.find((m: any) => m.status === 'ACTIVE' && new Date(m.endDate) > new Date())

  return (
    <div>
      <h2 className="text-xl font-bold font-heading mb-6">My Membership</h2>
      
      {!activeMembership ? (
        <div className="bg-muted/50 border border-border border-dashed p-12 text-center flex flex-col items-center">
          <Crown className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground font-semibold">You don't have an active membership</p>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">
            Upgrade to save up to 25% on food, get discounted courts, and earn priority reservations.
          </p>
          <Button asChild className="uppercase tracking-widest text-xs font-semibold">
            <Link href="/#memberships">View Plans</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-foreground text-background p-8 rounded-xl relative overflow-hidden">
          <Crown className="h-48 w-48 text-background/5 absolute -right-8 -bottom-12" />
          
          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-background/60 mb-2 block">
              Active Plan
            </span>
            <h3 className="text-4xl font-bold font-heading mb-6">{activeMembership.tier.name}</h3>
            
            <div className="space-y-4 mb-8 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24">Valid Until:</span>
                <span>{format(new Date(activeMembership.endDate), "MMMM do, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24">Discount:</span>
                <span>{activeMembership.tier.discountPct}% off food & courts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24">Status:</span>
                <span className="text-green-400 font-bold uppercase tracking-wider text-xs">Active</span>
              </div>
            </div>

            <Button variant="secondary" className="uppercase tracking-widest text-xs font-semibold">
              Manage Subscription
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
