import CtaSection from "./_components/cta"
import FaqSection from "./_components/faq"
import FeaturesSection from "./_components/features"
import HeroSection from "./_components/hero"
import PricingSection from "./_components/pricing"
import TestimonialsSection from "./_components/testimonials"
import UseCasesSection from "./_components/use-cases"

function MarketingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}

export default MarketingPage
