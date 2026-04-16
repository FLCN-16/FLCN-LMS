import dynamic from "next/dynamic"

import CourseDetailBreadcrumb from "./_components/breadcumb"
import CourseDetailHeader from "./_components/header"

// Dynamically import sections with loading skeletons
const CourseOverviewSection = dynamic(() => import("./_components/overview"), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseLearningSection = dynamic(() => import("./_components/learning"), {
  loading: () => <div className="h-48 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseCurriculumSection = dynamic(() => import("./_components/curriculum"), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseInstructorSection = dynamic(() => import("./_components/instructor"), {
  loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseReviewsSection = dynamic(() => import("./_components/reviews"), {
  loading: () => <div className="h-56 bg-muted/20 animate-pulse rounded-lg" />,
})

const CoursePackages = dynamic(() => import("./_components/packages"), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseTestimonials = dynamic(() => import("./_components/testimonials"), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseFAQSection = dynamic(() => import("./_components/faq"), {
  loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseRelatedSection = dynamic(() => import("./_components/related"), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseDetailSupport = dynamic(() => import("./_components/support"), {
  loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />,
})

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  return (
    <main id="course-detail-page" className="flex min-h-screen flex-col">
      <CourseDetailBreadcrumb />

      {/* Hero Section */}
      <section className="border-b border-border/40">
        <CourseDetailHeader />
      </section>

      {/* Main Content */}
      <div className="flex flex-col gap-y-12 py-12">
        {/* Overview */}
        <section className="container mx-auto px-4">
          <CourseOverviewSection />
        </section>

        {/* What You'll Learn */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseLearningSection />
          </div>
        </section>

        {/* Curriculum */}
        <section className="container mx-auto px-4">
          <CourseCurriculumSection />
        </section>

        {/* Instructor */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseInstructorSection />
          </div>
        </section>

        {/* Reviews & Ratings */}
        <section className="container mx-auto px-4">
          <CourseReviewsSection />
        </section>

        {/* Pricing Packages */}
        <section className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <CoursePackages />
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="container mx-auto px-4">
          <CourseTestimonials />
        </section>

        {/* FAQ */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseFAQSection />
          </div>
        </section>

        {/* Related Courses */}
        <section className="container mx-auto px-4">
          <CourseRelatedSection />
        </section>

        {/* Support Section */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseDetailSupport />
          </div>
        </section>
      </div>
    </main>
  )
}

export default CoursePage
