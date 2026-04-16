import Link from "next/link"

import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Progress } from "@flcn-lms/ui/components/progress"

import { getCourseWithModules } from "@/fetchers/course"
import { getEnrolledCourse } from "@/fetchers/course"

interface CourseConsumptionPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseConsumptionPage({ params }: CourseConsumptionPageProps) {
  const { courseSlug } = await params

  const course = await getCourseWithModules(courseSlug)
  const enrollment = await getEnrolledCourse(course.id)

  const modules = course.modules || []
  const totalLessons = modules.reduce(
    (sum, module) => sum + (module.lessons?.length || 0),
    0
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      {/* Main content area */}
      <div className="space-y-6">
        {/* Course header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {course.description && (
              <p className="mt-2 text-muted-foreground">{course.description}</p>
            )}
          </div>

          {/* Progress section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Your Progress</span>
              <span className="text-lg font-semibold">
                {enrollment.progressPercent}%
              </span>
            </div>
            <Progress
              value={enrollment.progressPercent}
              className="h-3"
            />
            <p className="text-sm text-muted-foreground">
              {Math.round((enrollment.progressPercent / 100) * totalLessons)}/
              {totalLessons} lessons completed
            </p>
          </div>
        </div>

        {/* Course tabs */}
        <div className="flex gap-2 border-b">
          <Button variant="ghost" size="sm" className="rounded-none border-b-2 border-primary">
            Modules & Lessons
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/learn/${courseSlug}/notes`}>
              Notes
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/learn/${courseSlug}/tests`}>
              Tests
            </Link>
          </Button>
        </div>

        {/* Modules list */}
        <div className="space-y-4">
          {modules.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No modules available yet
              </p>
            </Card>
          ) : (
            modules.map((module) => (
              <Card key={module.id} className="overflow-hidden">
                <div className="border-b p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{module.title}</h3>
                      {module.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {module.lessons?.length || 0} lessons
                    </span>
                  </div>
                </div>

                {/* Lessons in module */}
                <div className="divide-y">
                  {module.lessons && module.lessons.length > 0 ? (
                    module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseSlug}/${module.slug}/${lesson.slug}`}
                        className="block p-4 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-5 w-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {lesson.title}
                            </p>
                            {lesson.videoDurationSecs && (
                              <p className="text-xs text-muted-foreground">
                                {Math.round(lesson.videoDurationSecs / 60)} min
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No lessons yet
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Course Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Total Lessons</p>
              <p className="font-medium">{totalLessons}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rating</p>
              <p className="font-medium">⭐ {course.rating.toFixed(1)}</p>
            </div>
            {enrollment.expiresAt && (
              <div>
                <p className="text-muted-foreground">Access Until</p>
                <p className="font-medium">
                  {new Date(enrollment.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href={`/learn/${courseSlug}/tests`}>
              Take a Test
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href={`/learn/${courseSlug}/notes`}>
              View Notes
            </Link>
          </Button>
        </div>
      </aside>
    </div>
  )
}

export default CourseConsumptionPage
