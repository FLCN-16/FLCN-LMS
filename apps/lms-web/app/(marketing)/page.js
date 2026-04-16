import CtaBannerSection from "./_components/landing/cta-banner-section";
import FeaturedCoursesSection from "./_components/landing/featured-courses-section";
import FeaturesSection from "./_components/landing/features-section";
import HeroSection from "./_components/landing/hero-section";
import HowItWorksSection from "./_components/landing/how-it-works-section";
import StatsSection from "./_components/landing/stats-section";
import TestimonialsSection from "./_components/landing/testimonials-section";
export const metadata = {
    title: "FLCN LMS — Learn, Grow, Achieve",
    description: "Master in-demand skills with expert-led courses, hands-on tests, and a community of 10,000+ learners.",
};
export default function HomePage() {
    return (<main className="min-h-screen bg-background">
      <HeroSection />
      <StatsSection />
      <FeaturedCoursesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaBannerSection />
    </main>);
}
