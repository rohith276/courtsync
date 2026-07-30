"use client"

import { Utensils, Trophy } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function ModeToggle() {
  const pathname = usePathname()
  const router = useRouter()

  const isHome = pathname === "/"
  const isFood = pathname.startsWith("/food")
  const isPlay = pathname.startsWith("/booking")

  return (
    <div
      className={`flex items-center rounded-sm p-0.5 ${
        isHome ? "bg-muted ring-1 ring-border" : "bg-muted"
      }`}
      title={isHome ? "Play & Food — choose your experience" : undefined}
    >
      <button
        onClick={() => router.push("/booking")}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all ${
          isPlay
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Trophy className="h-3.5 w-3.5" />
        Play
      </button>
      <button
        onClick={() => router.push("/food")}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all ${
          isFood
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Utensils className="h-3.5 w-3.5" />
        Food
      </button>
    </div>
  )
}
