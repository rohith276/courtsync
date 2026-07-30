"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { QuantityControl } from "./quantity-control"
import { PaymentModal } from "@/components/shared/payment-modal"
import { applyCoupon, createFoodOrder } from "@/actions/food"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Loader2, Tag, Gift, MapPin } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deliveryType: string
  rewardPoints: number
}

export function CartDrawer({ open, onOpenChange, deliveryType, rewardPoints }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateQuantity, clearCart } = useCart()
  const { requireAuth } = useAuth()

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null)
  const [useRewards, setUseRewards] = useState(false)
  const [address, setAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Payment state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const { toast } = useToast()

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    const res = await applyCoupon(couponCode, subtotal)
    if (res.success) {
      setAppliedCoupon({ code: res.coupon!.code, discount: res.discount! })
      toast({ title: "Coupon applied!", description: `Saved ₹${res.discount}` })
    } else {
      toast({ title: "Invalid coupon", description: res.error || "Unknown error", variant: "destructive" })
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
  }

  const tax = subtotal * 0.05 // 5% GST for food
  let discount = appliedCoupon?.discount || 0
  let pointsUsed = 0

  if (useRewards) {
    const maxPointsValue = rewardPoints * 0.25
    const remainingTotal = subtotal + tax - discount
    // Use enough points to cover the remaining total, up to user's max points
    const pointsNeeded = Math.ceil(remainingTotal / 0.25)
    pointsUsed = Math.min(pointsNeeded, rewardPoints)
  }

  const rewardDiscount = pointsUsed * 0.25
  const total = Math.max(0, subtotal + tax - discount - rewardDiscount)

  const handleCheckout = () => {
    if (deliveryType === "DELIVERY" && !address) {
      toast({ title: "Address required", description: "Please enter a delivery address", variant: "destructive" })
      return
    }

    requireAuth(() => {
      setIsPaymentOpen(true)
    })
  }

  const processOrder = async (paymentMethod: string) => {
    setIsSubmitting(true)

    const res = await createFoodOrder({
      items: items.map(i => ({ menuItemId: i.id, quantity: i.quantity, price: i.price })),
      deliveryType,
      couponCode: appliedCoupon?.code,
      rewardPointsUsed: pointsUsed,
      deliveryAddress: deliveryType === "DELIVERY" ? address : undefined,
    })

    if (res.success) {
      toast({
        title: "Order Placed Successfully",
        description: `Order ID: ${res.orderId}. You earned ${res.pointsEarned} points!`
      })
      clearCart()
      setIsPaymentOpen(false)
      onOpenChange(false)
    } else {
      toast({ title: "Order Failed", description: res.error || "Unknown error", variant: "destructive" })
    }

    setIsSubmitting(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border bg-card">
        <SheetHeader className="p-6 border-b border-border text-left">
          <SheetTitle className="font-heading text-2xl uppercase">Your Order</SheetTitle>
          <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {itemCount} Items • {deliveryType.replace("_", " ")}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Delivery Address (if applicable) */}
          {deliveryType === "DELIVERY" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Delivery Address
              </label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter complete address"
                className="w-full border border-border bg-transparent p-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none h-20"
              />
            </div>
          )}

          {/* Items */}
          <div className="space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className={`mt-1 w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm leading-tight">{item.name}</h4>
                  <p className="text-muted-foreground text-xs mt-1">₹{item.price}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="font-mono font-semibold">₹{item.price * item.quantity}</span>
                  <QuantityControl
                    quantity={item.quantity}
                    onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="border border-dashed border-border p-4 bg-muted/20">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
              <Tag className="h-3 w-3" /> Apply Coupon
            </h4>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-500/10 text-green-700 dark:text-green-400 p-3 text-sm font-semibold border border-green-500/20">
                <span>{appliedCoupon.code} Applied</span>
                <button onClick={handleRemoveCoupon} className="text-xs uppercase hover:underline">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 border border-border bg-transparent px-3 text-sm uppercase focus:outline-none focus:border-foreground"
                />
                <button onClick={handleApplyCoupon} className="px-4 py-2 bg-foreground text-background text-xs font-semibold uppercase tracking-widest">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Rewards */}
          {rewardPoints > 0 && (
            <div className="border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
              <Gift className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">KortSync Rewards</h4>
                <p className="text-xs text-muted-foreground mt-1">You have {rewardPoints} points (Worth ₹{rewardPoints * 0.25})</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={useRewards} onChange={e => setUseRewards(e.target.checked)} />
                <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${useRewards ? 'bg-accent' : 'bg-muted-foreground/30'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${useRewards ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>
          )}

          {/* Summary */}
          <div className="space-y-2 pt-4 border-t border-border text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Coupon Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            {rewardDiscount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Rewards Redeemed</span>
                <span>-₹{rewardDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
              <span>To Pay</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-background">
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || items.length === 0}
            className="w-full h-14 bg-accent text-white flex items-center justify-center text-sm font-semibold uppercase tracking-widest disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <>Checkout <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </button>
        </div>
      </SheetContent>

      <PaymentModal
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        amount={total}
        onSuccess={processOrder}
        title="Complete Food Order"
      />
    </Sheet>
  )
}
