"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Minus, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Equipment {
  id: string
  name: string
  sportType: string
  price: number
}

export interface EquipmentSelection {
  equipmentId: string
  name: string
  price: number
  quantity: number
}

interface EquipmentRentalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sportType: string // "BADMINTON" or "CRICKET"
  onConfirm: (selections: EquipmentSelection[]) => void
  initialSelections?: EquipmentSelection[]
}

export function EquipmentRentalModal({
  open,
  onOpenChange,
  sportType,
  onConfirm,
  initialSelections = [],
}: EquipmentRentalModalProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selections, setSelections] = useState<Map<string, EquipmentSelection>>(new Map())

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      fetch(`/api/equipment?sport=${sportType}`)
        .then(res => res.json())
        .then(data => {
          setEquipment(data.equipment || [])
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
      
      // Initialize from existing selections
      const map = new Map<string, EquipmentSelection>()
      initialSelections.forEach(s => map.set(s.equipmentId, s))
      setSelections(map)
    }
  }, [open, sportType])

  const updateQty = (eq: Equipment, delta: number) => {
    setSelections(prev => {
      const next = new Map(prev)
      const existing = next.get(eq.id)
      const newQty = (existing?.quantity || 0) + delta

      if (newQty <= 0) {
        next.delete(eq.id)
      } else {
        next.set(eq.id, {
          equipmentId: eq.id,
          name: eq.name,
          price: eq.price,
          quantity: Math.min(newQty, 10),
        })
      }
      return next
    })
  }

  const totalRental = Array.from(selections.values()).reduce(
    (acc, s) => acc + s.price * s.quantity, 0
  )

  const handleConfirm = () => {
    onConfirm(Array.from(selections.values()))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-0 overflow-hidden">
        <div className="bg-foreground text-background p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-background">
              Add Equipment Rental
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-background/60 mt-2">
            Rent gear for your session. Or bring your own — it's up to you.
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : equipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No equipment available for this sport.
            </div>
          ) : (
            <div className="space-y-3">
              {equipment.map(eq => {
                const sel = selections.get(eq.id)
                const qty = sel?.quantity || 0

                return (
                  <div
                    key={eq.id}
                    className={`flex items-center justify-between p-4 border transition-all ${
                      qty > 0 ? "border-foreground bg-foreground/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{eq.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">₹{eq.price}/session</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {qty > 0 && (
                        <button
                          onClick={() => updateQty(eq, -1)}
                          className="w-8 h-8 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      )}
                      {qty > 0 && (
                        <span className="w-8 text-center font-mono font-bold text-sm">{qty}</span>
                      )}
                      <button
                        onClick={() => updateQty(eq, 1)}
                        className="w-8 h-8 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Equipment rental total</span>
              <span className="font-mono font-bold text-lg">₹{totalRental.toFixed(0)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelections(new Map())
                  onConfirm([])
                  onOpenChange(false)
                }}
                className="flex-1 h-12 border border-border text-sm font-semibold uppercase tracking-widest hover:bg-muted transition-colors"
              >
                Bring My Own
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 bg-foreground text-background text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                {selections.size > 0 ? `Add ₹${totalRental}` : "Skip"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
