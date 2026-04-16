import Link from "next/link"
import { notFound } from "next/navigation"

import { getMarketingTestSeries } from "@/fetchers/marketing"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Test Series",
  description: "Browse our comprehensive test series to prepare for your exams",
}

async function TestSeriesPage() {
  let testSeries: Awaited<ReturnType<typeof getMarketingTestSeries>>["data"] = []

  try {
    const result = await getMarketingTestSeries({ limit: 50 })
    testSeries = result.data
  } catch (error) {
    console.error("Error fetching test series:", error)
    notFound()
  }

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
              href={`/test-series/${series.slug}`}
              className="group"
            >
              <div className="h-full overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
                {/* Thumbnail placeholder */}
                <div className="flex aspect-video items-center justify-center bg-muted transition-colors group-hover:bg-muted/80">
                  <div className="text-center text-muted-foreground">
                    <p className="text-2xl font-semibold">{series.total_questions}</p>
                    <p className="text-sm">Questions</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
                    {series.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {series.description}
                  </p>

                  {/* Stats */}
                  <div className="mb-4 grid grid-cols-2 gap-4 border-b border-t py-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Questions</p>
                      <p className="font-semibold">{series.total_questions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {series.pricing_type === "free" ? "Access" : "Price"}
                      </p>
                      <p className="font-semibold">
                        {series.pricing_type === "free" ? "Free" : `₹${series.price}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Pass: {series.passing_percentage}%
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
}

export default TestSeriesPage
