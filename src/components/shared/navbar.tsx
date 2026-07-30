"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/context/auth-context"

const navLinks = [
  { name: "Play", href: "/#play" },
  { name: "Dine", href: "/#dine" },
  { name: "Memberships", href: "/#memberships" },
  { name: "About", href: "/#about" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { user, setAuthModalOpen, logout } = useAuth()

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border shadow-sm"
          : "bg-background/85 backdrop-blur-md border-border/50"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-sm flex items-center justify-center">
              <span className="text-background font-bold text-sm font-heading">CS</span>
            </div>
            <span className="text-lg font-bold tracking-tight font-heading uppercase hidden sm:inline-block">
              CourtSync
            </span>
          </Link>

          <div className="hidden sm:flex flex-1 justify-center md:justify-start md:pl-4 lg:pl-8">
            <ModeToggle />
          </div>

          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs lg:text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            <ThemeToggle />
            
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="uppercase tracking-widest text-xs font-semibold">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="uppercase tracking-widest text-xs font-semibold hidden lg:inline-flex">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)} className="uppercase tracking-widest text-xs font-semibold">
                Sign In
              </Button>
            )}

            <Button asChild size="sm" className="uppercase tracking-widest text-xs font-semibold">
              <Link href="/booking">Reserve Now</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden shrink-0">
            <div className="sm:hidden">
              <ModeToggle />
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium py-3 border-b border-border/50 uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <div className="flex gap-3">
                  {user ? (
                    <>
                      <Button asChild variant="outline" className="flex-1 uppercase tracking-widest text-xs font-semibold">
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                      </Button>
                      <Button variant="outline" onClick={() => { logout(); setIsMobileMenuOpen(false) }} className="flex-1 uppercase tracking-widest text-xs font-semibold">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => { setAuthModalOpen(true); setIsMobileMenuOpen(false) }} className="flex-1 uppercase tracking-widest text-xs font-semibold">
                      Sign In
                    </Button>
                  )}
                </div>
                <Button asChild className="w-full uppercase tracking-widest text-xs font-semibold">
                  <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>Reserve Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
