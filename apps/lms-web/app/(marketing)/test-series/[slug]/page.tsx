import { Metadata } from "next"
import { notFound } from "next/navigation"

import TestSeriesDetailHeader from "./_components/header"
import { getMarketingTestSeriesDetail } from "@/fetchers/marketing"
import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import Link from "next/link"
import { Clock, Target, BookOpen, CheckCircle, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const series = await getMarketingTestSeriesDetail(slug)
    return {
      title: series.title,
      description: series.description,
      openGraph: { title: series.title, description: series.description },
    }
  } catch {
    return { title: "Test Series" }
  }
}

export default async function TestSeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let testSeries: Awaited<ReturnType<typeof getMarketingTestSeriesDetail>>

  try {
    testSeries = await getMarketingTestSeriesDetail(slug)
  } catch {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <TestSeriesDetailHeader testSeries={testSeries} />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-12 lg:col-span-2">
            {/* Overview */}
            <div className="space-y-4">
              <Heading variant="h2">About This Test</Heading>
              <Text className="leading-relaxed text-muted-foreground">
                {testSeries.description}
              </Text>
            </div>

            {/* What's Included */}
            <div className="space-y-6">
              <Heading variant="h2">What's Included</Heading>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="flex gap-4 p-5">
                  <BookOpen className="h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1" />
                  <div className="space-y-1">
                    <Text className="font-semibold">
                      {testSeries.total_questions} Questions
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Comprehensive practice questions
                    </Text>
                  </div>
                </Card>

                <Card className="flex gap-4 p-5">
                  <Target className="h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-400 mt-1" />
                  <div className="space-y-1">
                    <Text className="font-semibold">Clear Target</Text>
                    <Text className="text-xs text-muted-foreground">
                      Score {testSeries.passing_percentage}% to pass
                    </Text>
                  </div>
                </Card>

                {testSeries.show_correct_answers && (
                  <Card className="flex gap-4 p-5">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-1" />
                    <div className="space-y-1">
                      <Text className="font-semibold">Answer Review</Text>
                      <Text className="text-xs text-muted-foreground">
                        See correct answers & explanations
                      </Text>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Test Sections */}
            {testSeries.sections && testSeries.sections.length > 0 && (
              <div className="space-y-6">
                <Heading variant="h2">Test Sections</Heading>
                <div className="space-y-3">
                  {testSeries.sections.map((section, index) => (
                    <Card key={section.id} className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <Text className="font-semibold">{section.title}</Text>
                              {section.description && (
                                <Text className="text-xs text-muted-foreground">
                                  {section.description}
                                </Text>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
                          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <Text className="text-sm font-semibold">{section.duration_minutes}m</Text>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <Heading variant="h3" className="mb-6 text-base">
                Test Configuration
              </Heading>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Text className="text-xs font-semibold text-muted-foreground uppercase">
                    Total Questions
                  </Text>
                  <Heading variant="h2" className="text-3xl">
                    {testSeries.total_questions}
                  </Heading>
                </div>

                {testSeries.sections && testSeries.sections.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <Text className="text-xs font-semibold text-muted-foreground uppercase">
                      Total Duration
                    </Text>
                    <Heading variant="h2" className="text-3xl">
                      {testSeries.sections.reduce((sum, s) => sum + s.duration_minutes, 0)}{" "}
                      <Text className="text-lg font-normal">min</Text>
                    </Heading>
                    <Text className="text-xs text-muted-foreground">
                      {testSeries.sections.length} section{testSeries.sections.length !== 1 ? "s" : ""}
                    </Text>
                  </div>
                )}

                <div className="border-t pt-4 space-y-2">
                  <Text className="text-xs font-semibold text-muted-foreground uppercase">
                    Passing Score
                  </Text>
                  <Heading variant="h2" className="text-3xl">
                    {testSeries.passing_percentage}<Text className="text-lg font-normal">%</Text>
                  </Heading>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Text className="text-xs font-semibold text-muted-foreground uppercase">
                    {testSeries.pricing_type === "free" ? "Access" : "Price"}
                  </Text>
                  <div className="flex items-baseline gap-2">
                    {testSeries.pricing_type === "free" ? (
                      <>
                        <Heading variant="h2" className="text-2xl text-green-600 dark:text-green-400">
                          Free
                        </Heading>
                      </>
                    ) : (
                      <>
                        <Heading variant="h2" className="text-3xl">
                          ₹{testSeries.price}
                        </Heading>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Button className="w-full" size="lg" asChild>
              <Link href="/auth/register">Start Test Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
