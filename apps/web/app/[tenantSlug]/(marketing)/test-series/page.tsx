import { useTranslations } from "next-intl"
import Link from "next/link"
import { notFound } from "next/navigation"

interface TestSeries {
  id: string
  slug: string
  title: string
  description: string
  testCount: number
  totalQuestions: number
  price: number
  thumbnail?: string
  category?: string
}

async function TestSeriesPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>
}) {
  const t = useTranslations("testSeries")
  const { tenantSlug } = await params

  // TODO: Replace with actual API call to fetch test series
  const testSeries: TestSeries[] = [
    {
      id: "1",
      slug: "entrance-exam-prep",
      title: "Entrance Exam Preparation",
      description: "Comprehensive test series for entrance exams",
      testCount: 12,
      totalQuestions: 600,
      price: 999,
    },
    {
      id: "2",
      slug: "mock-tests-series",
      title: "Mock Tests Series",
      description: "Full-length mock tests with detailed solutions",
      testCount: 5,
      totalQuestions: 250,
      price: 499,
    },
  ]

  if (!testSeries || testSeries.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
            <p className="text-muted-foreground text-lg">
              {t("noTestSeries")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("description")}
          </p>
        </div>

        {/* Test Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testSeries.map((series) => (
            <Link
              key={series.id}
              href={`/${tenantSlug}/test-series/${series.slug}`}
              className="group"
            >
              <div className="h-full border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card">
                {/* Thumbnail */}
                <div className="aspect-video bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                  {series.thumbnail ? (
                    <img
                      src={series.thumbnail}
                      alt={series.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      {series.testCount} Tests
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {series.category && (
                    <p className="text-sm text-primary mb-2">
                      {series.category}
                    </p>
                  )}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {series.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        {t("testsCount")}
                      </p>
                      <p className="font-semibold">{series.testCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("questionsCount")}
                      </p>
                      <p className="font-semibold">
                        {series.totalQuestions}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ₹{series.price}
                    </span>
                    <span className="text-sm text-primary font-medium">
                      {t("viewDetails")} →
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
