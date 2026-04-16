import Link from "next/link"

import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Empty } from "@flcn-lms/ui/components/empty"

import { getCourseWithModules } from "@/fetchers/course"
import { getTestSeries } from "@/fetchers/test-series"

interface CourseTestsPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseTestsPage({ params }: CourseTestsPageProps) {
  const { courseSlug } = await params

  const course = await getCourseWithModules(courseSlug)

  // Fetch all test series (in a real app, we'd fetch tests specific to this course)
  const allTestSeries = await getTestSeries()

  if (allTestSeries.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tests & Practice</h1>
          <p className="mt-1 text-muted-foreground">
            Assess your learning with tests and practice problems
          </p>
        </div>

        <Empty
          title="No tests available"
          description="Tests for this course will be available soon."
          action={
            <Button asChild variant="outline">
              <Link href={`/learn/${courseSlug}`}>Back to Course</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tests & Practice</h1>
        <p className="mt-1 text-muted-foreground">
          Assess your learning with tests and practice problems
        </p>
      </div>

      {/* Test Series Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Tests</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {allTestSeries.map((series) => (
            <Link
              key={series.id}
              href={`/test/${series.slug}`}
            >
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                <h3 className="font-semibold text-lg mb-2">{series.title}</h3>
                {series.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {series.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    {series.totalTests || 0} tests
                  </span>
                  <Button size="sm" variant="outline">
                    Start Test
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* DPP Section - Placeholder */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Daily Practice Problems (DPP)</h2>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Daily practice problems will be available soon
          </p>
        </Card>
      </div>

      <Button asChild variant="outline">
        <Link href={`/learn/${courseSlug}`}>Back to Course</Link>
      </Button>
    </div>
  )
}

export default CourseTestsPage
