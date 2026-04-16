import Image from "next/image"
import Link from "next/link"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Empty } from "@flcn-lms/ui/components/empty"
import { Progress } from "@flcn-lms/ui/components/progress"

import { getEnrolledCourses } from "@/fetchers/user"

async function LibraryPage() {
  const { data: enrollments } = await getEnrolledCourses(1, 20)

  if (enrollments.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Empty
          title="No courses yet"
          description="Start learning by enrolling in a course from our catalog."
          action={
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold">My Learning Library</h1>
        <p className="mt-1 text-muted-foreground">
          You have {enrollments.length} enrolled course{enrollments.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => {
          const course = (enrollment as any).course
          if (!course) return null

          return (
            <Link
              key={enrollment.id}
              href={`/learn/${course.slug}`}
              className="group"
            >
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                {/* Course thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Course content */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold text-base">
                      {course.title}
                    </h3>
                  </div>

                  {course.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  )}

                  {/* Progress section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {enrollment.progressPercent}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progressPercent}
                      className="h-2"
                    />
                  </div>

                  {/* Course meta */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {course.rating > 0 && (
                        <Badge variant="secondary">
                          ⭐ {course.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {course.totalLessons} lessons
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default LibraryPage
