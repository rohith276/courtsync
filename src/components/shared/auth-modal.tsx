"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login } = useAuth()
  const [email, setEmail] = useState("test@example.com")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(email)

    if (success) {
      toast({ title: "Welcome back!", description: "You have successfully signed in." })
      setAuthModalOpen(false)
    } else {
      toast({ title: "Sign in failed", description: "Could not find your account.", variant: "destructive" })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="mb-4 text-center">
          <div className="w-12 h-12 bg-foreground rounded-sm flex items-center justify-center mx-auto mb-4">
            <span className="text-background font-bold text-xl font-heading">KS</span>
          </div>
          <DialogTitle className="font-heading text-2xl uppercase tracking-tight">Sign In to KortSync</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email to book courts, order food, and view your rewards.
          </p>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Mail className="h-3 w-3" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-border bg-transparent p-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <p className="text-[10px] text-muted-foreground">For this prototype, any email works. Use test@example.com for seeded data.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-12 bg-foreground text-background flex items-center justify-center text-xs font-semibold uppercase tracking-widest disabled:opacity-50 transition-opacity hover:opacity-90 mt-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
