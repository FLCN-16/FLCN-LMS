import Link from "next/link"

import { Button } from "@flcn-lms/ui/components/button"

import CourseCard from "@/components/card/course"
import { getFeaturedCourses } from "@/fetchers/marketing"

async function FeaturedCoursesSection() {
  let courses: Awaited<ReturnType<typeof getFeaturedCourses>> = []

  try {
    courses = await getFeaturedCourses(4)
  } catch {
    // Fall back to empty — section still renders without courses
  }

  if (courses.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 space-y-2 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Popular Courses
            </h2>
            <p className="text-muted-foreground">
              Learn from the best instructors in their fields
            </p>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                price={course.price}
                imageUrl={course.thumbnail_url || "https://placehold.co/320x180/18181b/ffffff?text=Course"}
                level={course.level}
                estimatedHours={course.estimated_hours}
                totalEnrolled={course.total_enrolled}
                averageRating={course.average_rating}
                reviewCount={course.review_count}
                certificateIncluded={course.certificate_included}
                instructorName={course.instructor ? `${course.instructor.first_name} ${course.instructor.last_name}` : undefined}
                isFeatured={course.is_featured}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCoursesSection
