"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { PaymentModal } from "@/components/shared/payment-modal"
import { createMembership } from "@/actions/memberships"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const tiers = [
  {
    name: "Drop-In",
    price: "₹0",
    period: "",
    description: "Just visiting? No commitment needed.",
    features: [
      "Pay per session — courts & café",
      "Standard hourly rates",
      "Full menu access",
      "Join public tournaments",
    ],
    buttonText: "Walk In Anytime",
    highlight: false,
  },
  {
    name: "Regular",
    price: "₹1,999",
    period: "/month",
    description: "For players who come 2–3 times a week.",
    features: [
      "20% off court bookings",
      "15% off all food & drinks",
      "Priority slot reservations",
      "Free tournament entry (1/mo)",
      "Loyalty points on every visit",
    ],
    buttonText: "Join Regular",
    highlight: true,
  },
  {
    name: "Elite",
    price: "₹4,999",
    period: "/month",
    description: "Unlimited play. Unlimited perks.",
    features: [
      "Unlimited court access",
      "25% off all food & drinks",
      "Dedicated locker",
      "Guest passes (2/mo)",
      "Free coaching session (1/mo)",
      "Birthday month: free table reservation",
    ],
    buttonText: "Go Elite",
    highlight: false,
  },
]

export function PricingCards() {
  const { user, requireAuth } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [selectedTier, setSelectedTier] = useState<any>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const handleJoin = (tier: any) => {
    if (tier.name === "Drop-In") {
      router.push("/booking")
      return
    }

    requireAuth(() => {
      setSelectedTier(tier)
      setIsPaymentOpen(true)
    })
  }

  const processMembership = async (method: string) => {
    if (!user || !selectedTier) return

    const res = await createMembership(user.email, selectedTier.name)
    if (res.success) {
      toast({ title: "Welcome to the Club!", description: `You are now a ${selectedTier.name} member.` })
      setIsPaymentOpen(false)
      router.push("/dashboard/memberships")
    } else {
      toast({ title: "Transaction Failed", description: res.error || "Unknown error", variant: "destructive" })
    }
  }

  return (
    <section id="memberships" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
            Memberships
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4">
            Play more. Eat more. Save more.
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Memberships cover both courts and dining — one card for everything.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 md:gap-px bg-border max-w-5xl mx-auto border border-border">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 md:p-10 flex flex-col ${
                tier.highlight
                  ? "bg-foreground text-background"
                  : "bg-card"
              }`}
            >
              <div className="mb-8">
                <h3 className={`text-sm font-semibold uppercase tracking-[0.2em] mb-6 ${
                  tier.highlight ? "text-background/60" : "text-muted-foreground"
                }`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-extrabold font-heading">{tier.price}</span>
                  {tier.period && (
                    <span className={`text-sm ${tier.highlight ? "text-background/60" : "text-muted-foreground"}`}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${tier.highlight ? "text-background/70" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                      tier.highlight ? "text-accent" : "text-accent"
                    }`} />
                    <span className={`text-sm ${tier.highlight ? "text-background/80" : "text-muted-foreground"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlight ? "secondary" : "outline"}
                className="w-full rounded-none uppercase tracking-widest text-xs font-semibold h-12"
                onClick={() => handleJoin(tier)}
              >
                {tier.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedTier && (
        <PaymentModal
          open={isPaymentOpen}
          onOpenChange={setIsPaymentOpen}
          amount={parseInt(selectedTier.price.replace(/\D/g, ''))} // parse ₹1,999 to 1999
          onSuccess={processMembership}
          title={`Join ${selectedTier.name} Membership`}
        />
      )}
    </section>
  )
}
