import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CourtPreview } from "@/components/landing/court-preview"
import { MenuPreview } from "@/components/landing/menu-preview"
import { FeaturesBento } from "@/components/landing/features-bento"
import { PricingCards } from "@/components/landing/pricing-cards"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <CourtPreview />
        <MenuPreview />
        <FeaturesBento />
        <PricingCards />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
