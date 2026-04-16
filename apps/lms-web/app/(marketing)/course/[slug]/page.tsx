import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

import CourseDetailBreadcrumb from "./_components/breadcumb"
import CourseDetailHeader from "./_components/header"

import Link from "next/link"

import {
  getMarketingCourse,
  getCourseCurriculum,
  getRelatedCourses,
  getMarketingCoursePackages,
  type MarketingCourseDetail,
  type CurriculumModule,
  type MarketingCourseList,
  type CoursePackage,
} from "@/fetchers/marketing"
import CourseCard from "@/components/card/course"

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

const CourseRequirementsSection = dynamic(() => import("./_components/requirements"), {
  loading: () => <div className="h-32 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseAudienceSection = dynamic(() => import("./_components/audience"), {
  loading: () => <div className="h-32 bg-muted/20 animate-pulse rounded-lg" />,
})

const CourseCareerOutcomesSection = dynamic(() => import("./_components/career-outcomes"), {
  loading: () => <div className="h-48 bg-muted/20 animate-pulse rounded-lg" />,
})

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  let course: MarketingCourseDetail
  let curriculum: CurriculumModule[] = []
  let related: MarketingCourseList[] = []
  let packages: CoursePackage[] = []

  try {
    course = await getMarketingCourse(slug)
  } catch {
    notFound()
  }

  // Fetch curriculum, related courses, and packages in parallel — non-fatal
  try {
    ;[curriculum, related, packages] = await Promise.all([
      getCourseCurriculum(slug),
      getRelatedCourses(slug),
      getMarketingCoursePackages(slug),
    ])
  } catch {
    // Sections will render with empty/fallback data
  }

  const isBundleChild = !!(course!.parent_course_id && course!.parent_course)

  return (
    <main id="course-detail-page" className="flex min-h-screen flex-col">
      <CourseDetailBreadcrumb />

      {/* Part-of-bundle banner */}
      {isBundleChild && course!.parent_course && (
        <div className="border-b border-border/20 bg-primary/5 py-2 text-center text-sm text-muted-foreground">
          This course is included in the{" "}
          <Link
            href={`/course/${course!.parent_course.slug}`}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {course!.parent_course.title}
          </Link>{" "}
          bundle
        </div>
      )}

      {/* Hero Section */}
      <section className="border-b border-border/40">
        <CourseDetailHeader course={course!} />
      </section>

      {/* Main Content */}
      <div className="flex flex-col gap-y-12 py-12">
        {/* Overview */}
        <section className="container mx-auto px-4">
          <CourseOverviewSection course={course!} />
        </section>

        {/* What You'll Learn */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseLearningSection whatYouLearn={course!.what_you_learn ?? []} />
          </div>
        </section>

        {/* Requirements */}
        {course!.requirements && course!.requirements.length > 0 && (
          <section className="container mx-auto px-4">
            <CourseRequirementsSection requirements={course!.requirements ?? []} />
          </section>
        )}

        {/* Who This Course Is For */}
        {course!.target_audience && course!.target_audience.length > 0 && (
          <section className="bg-muted/30">
            <div className="container mx-auto px-4 py-12">
              <CourseAudienceSection targetAudience={course!.target_audience ?? []} />
            </div>
          </section>
        )}

        {/* Curriculum */}
        <section className="container mx-auto px-4">
          <CourseCurriculumSection modules={curriculum} />
        </section>

        {/* Instructor */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseInstructorSection instructor={course!.instructor} />
          </div>
        </section>

        {/* Reviews & Ratings */}
        <section className="container mx-auto px-4">
          <CourseReviewsSection averageRating={course!.average_rating} reviewCount={course!.review_count} />
        </section>

        {/* Career Outcomes */}
        {course!.career_outcomes && course!.career_outcomes.length > 0 && (
          <section className="bg-muted/30">
            <div className="container mx-auto px-4 py-12">
              <CourseCareerOutcomesSection
                careerOutcomes={course!.career_outcomes ?? []}
                companies={course!.companies ?? []}
              />
            </div>
          </section>
        )}

        {/* Pricing Packages */}
        {packages.length > 0 && (
          <section className="bg-primary/5 py-12">
            <div className="container mx-auto px-4">
              <CoursePackages packages={packages} />
            </div>
          </section>
        )}

        {/* Student Testimonials */}
        <section className="container mx-auto px-4">
          <CourseTestimonials />
        </section>

        {/* FAQ */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <CourseFAQSection faq={course!.faq ?? []} />
          </div>
        </section>

        {/* Bundle Contents — show child courses when this is a bundle */}
        {course!.is_bundle && course!.children && course!.children.length > 0 && (
          <section className="container mx-auto px-4">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">What&apos;s in This Bundle</h2>
                <p className="mt-3 text-base text-muted-foreground">
                  {course!.children.length} courses included — purchase once, access all
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {course!.children.map((child) => (
                  <CourseCard
                    key={child.id}
                    id={child.id}
                    title={child.title}
                    slug={child.slug}
                    price={child.price}
                    imageUrl={
                      child.thumbnail_url ||
                      "https://placehold.co/320x180/18181b/ffffff?text=Course"
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Courses */}
        {related.length > 0 && (
          <section className="container mx-auto px-4">
            <CourseRelatedSection courses={related} />
          </section>
        )}

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
