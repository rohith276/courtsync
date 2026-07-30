import Link from "next/link"
import { Globe, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-background rounded-sm flex items-center justify-center">
                <span className="text-foreground font-bold text-sm font-heading">KS</span>
              </div>
              <span className="text-lg font-bold tracking-tight font-heading uppercase">
                KortSync
              </span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              Premium indoor sports and a full-service restaurant under one roof — play, dine, and unwind.
            </p>
            <div className="flex items-start gap-3 text-sm text-background/60 mt-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>123 Sports Avenue, Koramangala, Bengaluru 560034</span>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-background/40">Play</h3>
            <ul className="space-y-3 text-sm text-background/60">
              <li><Link href="/booking" className="hover:text-background transition-colors">Book a Court</Link></li>
              <li><Link href="/#play" className="hover:text-background transition-colors">Court Rates</Link></li>
              <li><Link href="/#memberships" className="hover:text-background transition-colors">Memberships</Link></li>
              <li><Link href="/booking" className="hover:text-background transition-colors">Equipment Rental</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-background/40">Dine</h3>
            <ul className="space-y-3 text-sm text-background/60">
              <li><Link href="/food" className="hover:text-background transition-colors">View Menu</Link></li>
              <li><Link href="/food" className="hover:text-background transition-colors">Dine-in & Takeaway</Link></li>
              <li><Link href="/food" className="hover:text-background transition-colors">Courtside Delivery</Link></li>
              <li><Link href="/dashboard/rewards" className="hover:text-background transition-colors">Rewards Program</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-background/40">Contact</h3>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@kortsync.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0" />
                <span>kortsync.in</span>
              </li>
            </ul>
            <div className="mt-6 text-xs text-background/40">
              Open Daily: 6:00 AM – 12:00 AM
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} KortSync. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-background/40">
            <Link href="/#about" className="hover:text-background transition-colors">About</Link>
            <Link href="/#memberships" className="hover:text-background transition-colors">Memberships</Link>
            <Link href="/dashboard" className="hover:text-background transition-colors">My Account</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
