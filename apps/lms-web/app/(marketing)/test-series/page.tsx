import Link from "next/link"
import { notFound } from "next/navigation"

import { getTestSeries } from "@/fetchers/test-series"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Test Series",
  description: "Browse our comprehensive test series to prepare for your exams",
}

async function TestSeriesPage() {
  try {
    const testSeries = await getTestSeries()

    if (!testSeries || testSeries.length === 0) {
      return (
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">Test Series</h1>
              <p className="text-lg text-muted-foreground">
                No test series available at the moment. Check back soon!
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold">Test Series</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Prepare for your exams with our comprehensive test series.
              Practice with real-world questions and track your progress.
            </p>
          </div>

          {/* Test Series Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testSeries.map((series) => (
              <Link
                key={series.id}
                href={`/test-series/${series.id}`}
                className="group"
              >
                <div className="h-full overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
                  {/* Thumbnail */}
                  <div className="flex aspect-video items-center justify-center bg-muted transition-colors group-hover:bg-muted/80">
                    {series.thumbnail ? (
                      <img
                        src={series.thumbnail}
                        alt={series.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p className="text-2xl font-semibold">
                          {series.testCount}
                        </p>
                        <p className="text-sm">Tests</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {series.category && (
                      <p className="mb-2 text-sm text-primary">
                        {series.category}
                      </p>
                    )}
                    <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
                      {series.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {series.description}
                    </p>

                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-2 gap-4 border-t border-b py-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tests</p>
                        <p className="font-semibold">{series.testCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Questions</p>
                        <p className="font-semibold">{series.totalQuestions}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ₹{series.price}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching test series:", error)
    notFound()
  }
}

export default TestSeriesPage
