import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@flcn-lms/ui/components/button"

import { getMarketingInstructor } from "@/fetchers/marketing"
import CourseCard from "@/components/card/course"

interface InstructorPageProps {
  params: Promise<{ slug: string }>
}

async function InstructorPage({ params }: InstructorPageProps) {
  // The route param is the instructor's UUID (named "slug" for legacy reasons)
  const { slug: id } = await params

  let data: Awaited<ReturnType<typeof getMarketingInstructor>>

  try {
    data = await getMarketingInstructor(id)
  } catch {
    notFound()
  }

  const { instructor, courses, course_count } = data!
  const fullName = `${instructor.first_name} ${instructor.last_name}`
  const initials = `${instructor.first_name?.[0] ?? ""}${instructor.last_name?.[0] ?? ""}`

  return (
    <main className="min-h-screen bg-background">
      {/* Instructor hero */}
      <section className="border-b border-border/40 bg-muted/30 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
            {/* Avatar */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full">
              {instructor.profile_picture_url ? (
                <Image
                  src={instructor.profile_picture_url}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-3xl font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="capitalize text-muted-foreground">{instructor.role}</p>
              <p className="text-sm text-muted-foreground">
                {course_count} {course_count === 1 ? "course" : "courses"} published
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-2xl font-bold">
            Courses by {instructor.first_name}
          </h2>

          {courses.length === 0 ? (
            <div className="rounded-lg border border-border/30 bg-muted/10 py-16 text-center">
              <p className="text-muted-foreground">No courses published yet.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  slug={course.slug}
                  price={course.price}
                  imageUrl={
                    course.thumbnail_url ||
                    "https://placehold.co/320x180/18181b/ffffff?text=Course"
                  }
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
          )}
        </div>
      </section>
    </main>
  )
}

export default InstructorPage
