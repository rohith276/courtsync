"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { getUserDashboardData } from "@/actions/dashboard"
import { format, parseISO } from "date-fns"
import { CalendarDays, Loader2, MapPin, Clock, Package } from "lucide-react"

export default function BookingsPage() {
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

  const bookings = data?.bookings || []

  return (
    <div>
      <h2 className="text-xl font-bold font-heading mb-6">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-muted/50 border border-border border-dashed p-12 text-center flex flex-col items-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground font-semibold">No bookings found</p>
          <p className="text-sm text-muted-foreground mt-1">When you book a court, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div key={booking.id} className="border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-foreground/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{booking.court.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {format(new Date(booking.date), "MMM do, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Equipment Sub-list */}
              {booking.equipments && booking.equipments.length > 0 && (
                <div className="w-full md:w-auto flex-1 md:pl-16 mt-2 md:mt-0">
                  <div className="bg-muted/30 border border-border p-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Rented Gear</p>
                    {booking.equipments.map((eq: any) => (
                      <div key={eq.id} className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Package className="h-3 w-3" />
                          {eq.equipment.name} <span className="font-mono">x{eq.quantity}</span>
                        </span>
                        <span className="font-mono">₹{eq.price * eq.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 mt-4 md:mt-0">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                  booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                }`}>
                  {booking.status}
                </span>
                <span className="font-mono font-bold text-lg">
                  ₹{booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
