import type { Metadata } from "next"
import dynamic from "next/dynamic"

import HeroSection from "./_components/landing/hero-section"
import StatsSection from "./_components/landing/stats-section"
import FeaturedCoursesSection from "./_components/landing/featured-courses-section"

// Lazy load below-the-fold sections for better initial page load performance
const FeaturesSection = dynamic(
  () => import("./_components/landing/features-section"),
  { loading: () => <div className="h-96 bg-muted/20 animate-pulse" /> }
)

const HowItWorksSection = dynamic(
  () => import("./_components/landing/how-it-works-section"),
  { loading: () => <div className="h-96 bg-muted/20 animate-pulse" /> }
)

const TestimonialsSection = dynamic(
  () => import("./_components/landing/testimonials-section"),
  { loading: () => <div className="h-96 bg-muted/20 animate-pulse" /> }
)

const CtaBannerSection = dynamic(
  () => import("./_components/landing/cta-banner-section"),
  { loading: () => <div className="h-64 bg-muted/20 animate-pulse" /> }
)

export const metadata: Metadata = {
  title: "FLCN LMS — Learn, Grow, Achieve",
  description:
    "Master in-demand skills with expert-led courses, hands-on tests, and a community of 10,000+ learners.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <StatsSection />
      <FeaturedCoursesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaBannerSection />
    </main>
  )
}
