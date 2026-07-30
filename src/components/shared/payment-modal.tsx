"use client"

import { useState } from "react"
import { Loader2, CreditCard, QrCode, Building2, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  onSuccess: (paymentMethod: string) => Promise<void>
  title?: string
}

export function PaymentModal({ open, onOpenChange, amount, onSuccess, title = "Complete Payment" }: PaymentModalProps) {
  const [method, setMethod] = useState("UPI")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePay = async () => {
    setIsProcessing(true)
    
    // Simulate network delay and payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setIsProcessing(false)
    setIsSuccess(true)
    
    // Wait a brief moment to show success state before triggering callback
    setTimeout(async () => {
      await onSuccess(method)
      setIsSuccess(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        
        {/* Gateway Header */}
        <div className="bg-foreground text-background p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-background/60 text-xs font-semibold uppercase tracking-widest mb-1">
                Merchant
              </div>
              <div className="font-heading font-bold text-lg">CourtSync App</div>
            </div>
            <div className="text-right">
              <div className="text-background/60 text-xs font-semibold uppercase tracking-widest mb-1">
                Amount to pay
              </div>
              <div className="font-mono font-bold text-2xl">₹{amount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="font-heading font-bold text-2xl mb-2">Payment Successful</h3>
            <p className="text-muted-foreground text-sm">Redirecting...</p>
          </div>
        ) : (
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-heading text-xl">{title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select Payment Method</h4>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setMethod("UPI")}
                  className={`flex items-center gap-4 p-4 border text-left transition-all ${
                    method === "UPI" ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"
                  }`}
                >
                  <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">UPI / QR</div>
                    <div className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === "UPI" ? "border-foreground" : "border-border"}`}>
                    {method === "UPI" && <div className="w-2 h-2 rounded-full bg-foreground" />}
                  </div>
                </button>

                <button
                  onClick={() => setMethod("CARD")}
                  className={`flex items-center gap-4 p-4 border text-left transition-all ${
                    method === "CARD" ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"
                  }`}
                >
                  <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Credit / Debit Card</div>
                    <div className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === "CARD" ? "border-foreground" : "border-border"}`}>
                    {method === "CARD" && <div className="w-2 h-2 rounded-full bg-foreground" />}
                  </div>
                </button>

                <button
                  onClick={() => setMethod("NET_BANKING")}
                  className={`flex items-center gap-4 p-4 border text-left transition-all ${
                    method === "NET_BANKING" ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"
                  }`}
                >
                  <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Net Banking</div>
                    <div className="text-xs text-muted-foreground">All Indian Banks supported</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === "NET_BANKING" ? "border-foreground" : "border-border"}`}>
                    {method === "NET_BANKING" && <div className="w-2 h-2 rounded-full bg-foreground" />}
                  </div>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full h-14 bg-accent text-white flex items-center justify-center text-sm font-semibold uppercase tracking-widest disabled:opacity-50 transition-opacity hover:opacity-90"
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    `Pay ₹${amount.toFixed(2)}`
                  )}
                </button>
                <p className="text-center text-[10px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Secured by Simulated Gateway
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
