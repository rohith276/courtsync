"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { getUserDashboardData } from "@/actions/dashboard"
import { format } from "date-fns"
import { ShoppingBag, Loader2, Utensils } from "lucide-react"

export default function OrdersPage() {
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

  const orders = data?.orders || []

  return (
    <div>
      <h2 className="text-xl font-bold font-heading mb-6">Food Orders</h2>
      
      {orders.length === 0 ? (
        <div className="bg-muted/50 border border-border border-dashed p-12 text-center flex flex-col items-center">
          <Utensils className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground font-semibold">No food orders yet</p>
          <p className="text-sm text-muted-foreground mt-1">Visit our cafe to grab a bite.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-border p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                      order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' : 'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-2">
                    {format(new Date(order.createdAt), "MMM do, h:mm a")} • {order.deliveryType.replace("_", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xl">₹{order.totalAmount.toFixed(2)}</span>
                  {order.discount > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-1">Saved ₹{order.discount.toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {order.orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold w-6">{item.quantity}x</span>
                      <span>{item.menuItem.name}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
