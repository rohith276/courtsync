"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { getUserDashboardData } from "@/actions/dashboard"
import { format } from "date-fns"
import { Gift, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function RewardsPage() {
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

  const txns = data?.rewardTxns || []
  const totalPoints = data?.rewardPoints || 0
  const pointsValue = (totalPoints * 0.25).toFixed(2)

  return (
    <div>
      <h2 className="text-xl font-bold font-heading mb-6">CourtSync Rewards</h2>
      
      <div className="bg-accent/10 border border-accent/20 p-6 rounded-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">Available Points</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-heading text-accent">{totalPoints}</span>
            <span className="text-muted-foreground font-semibold text-sm">pts</span>
          </div>
        </div>
        <div className="bg-background border border-border p-4 rounded-md min-w-[200px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Value Equivalent</p>
          <span className="text-xl font-mono font-bold">₹{pointsValue}</span>
          <p className="text-[10px] text-muted-foreground mt-1">Can be used on food orders</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Transaction History</h3>
      
      {txns.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No reward transactions yet.
        </div>
      ) : (
        <div className="space-y-3">
          {txns.map((txn: any) => {
            const isEarned = txn.points > 0
            return (
              <div key={txn.id} className="flex items-center justify-between p-4 border border-border rounded-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isEarned ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                  }`}>
                    {isEarned ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{txn.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(txn.createdAt), "MMM do, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
                <div className={`font-mono font-bold ${isEarned ? 'text-green-600' : 'text-red-600'}`}>
                  {isEarned ? '+' : ''}{txn.points}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
