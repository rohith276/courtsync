"use client"

import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, MapPin, CreditCard, Loader2, Package, Plus } from "lucide-react"
import { EquipmentSelection } from "./equipment-rental-modal"

interface BookingSummaryProps {
  date: string
  courtName: string
  courtType: string
  startTime: string
  endTime: string
  hours: number
  ratePerHour: number
  equipmentSelections: EquipmentSelection[]
  isSubmitting: boolean
  onConfirm: () => void
  onAddEquipment: () => void
}

export function BookingSummary({
  date,
  courtName,
  courtType,
  startTime,
  endTime,
  hours,
  ratePerHour,
  equipmentSelections,
  isSubmitting,
  onConfirm,
  onAddEquipment,
}: BookingSummaryProps) {
  const courtFee = ratePerHour * hours
  const equipmentFee = equipmentSelections.reduce((acc, s) => acc + s.price * s.quantity, 0)
  const subtotal = courtFee + equipmentFee
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax

  return (
    <div className="bg-foreground text-background p-6 md:p-8 sticky top-24">
      <h3 className="text-xl font-bold font-heading mb-6">Booking Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="h-5 w-5 shrink-0 text-background/50" />
          <div>
            <p className="font-semibold">{courtName}</p>
            <p className="text-background/50 text-xs mt-0.5">KortSync Koramangala</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <CalendarDays className="h-5 w-5 shrink-0 text-background/50" />
          <p className="font-semibold mt-0.5">{date}</p>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Clock className="h-5 w-5 shrink-0 text-background/50" />
          <div>
            <p className="font-semibold mt-0.5">{startTime} — {endTime}</p>
            <p className="text-background/50 text-xs mt-0.5">
              {hours} {hours > 1 ? "hours" : "hour"} • ₹{ratePerHour}/hr
            </p>
          </div>
        </div>
      </div>

      {/* Equipment section */}
      <div className="border-t border-background/20 pt-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-background/50">Equipment</span>
          <button
            onClick={onAddEquipment}
            className="text-xs font-semibold uppercase tracking-widest text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
          >
            <Plus className="h-3 w-3" />
            {equipmentSelections.length > 0 ? "Edit" : "Add Gear"}
          </button>
        </div>
        {equipmentSelections.length === 0 ? (
          <p className="text-xs text-background/40 italic">Bringing your own equipment</p>
        ) : (
          <div className="space-y-2">
            {equipmentSelections.map(eq => (
              <div key={eq.equipmentId} className="flex justify-between text-sm">
                <span className="text-background/70">
                  <Package className="h-3 w-3 inline mr-1.5" />
                  {eq.name} ×{eq.quantity}
                </span>
                <span className="font-mono">₹{(eq.price * eq.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="border-t border-background/20 pt-4 mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-background/50">Court Fee ({hours}hr)</span>
          <span>₹{courtFee.toFixed(2)}</span>
        </div>
        {equipmentFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-background/50">Equipment Rental</span>
            <span>₹{equipmentFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-background/50">GST (18%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t border-background/20">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full h-14 text-base font-semibold uppercase tracking-widest bg-accent text-white hover:bg-accent/90 rounded-none"
        onClick={onConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay & Confirm
          </>
        )}
      </Button>
    </div>
  )
}
