import Link from "next/link"
import { Clock, Target, BookOpen } from "lucide-react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import { cn } from "@flcn-lms/ui/lib/utils"

import { type MarketingTestSeriesDetail } from "@/fetchers/marketing"

interface TestSeriesDetailHeaderProps {
  testSeries: MarketingTestSeriesDetail
}

function TestSeriesDetailHeader({ testSeries }: TestSeriesDetailHeaderProps) {
  const totalDuration = testSeries.sections
    ? testSeries.sections.reduce((sum, s) => sum + s.duration_minutes, 0)
    : 0

  return (
    <section
      id="test-series-detail-header"
      className="relative mb-18 bg-gray-100 py-12 pb-26 dark:bg-black"
    >
      <div className="container grid grid-cols-12">
        <div className="col-span-8 flex flex-col gap-y-3">
          {/* Badge pills */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{testSeries.total_questions} Questions</Badge>
            {totalDuration > 0 && (
              <Badge variant="secondary">{totalDuration} Minutes</Badge>
            )}
            <Badge variant="secondary">{testSeries.passing_percentage}% Pass Score</Badge>
          </div>

          {/* Title */}
          <Heading variant="h1" className="font-heading">
            {testSeries.title}
          </Heading>

          {/* Description */}
          {testSeries.description && (
            <p className="text-lg text-muted-foreground">
              {testSeries.description}
            </p>
          )}

          <div className="inline-flex flex-col items-start gap-y-4">
            {/* Metadata badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {testSeries.total_questions} Questions
              </Badge>
              {totalDuration > 0 && (
                <Badge variant="outline">
                  {totalDuration} min
                </Badge>
              )}
              {testSeries.show_correct_answers && (
                <Badge variant="outline">Answer Review</Badge>
              )}
              {testSeries.shuffle_questions && (
                <Badge variant="outline">Shuffled</Badge>
              )}
            </div>

            {/* CTA */}
            <Button size="lg" asChild>
              <Link href="/auth/register">Start Test Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 container grid translate-y-1/2 transform grid-cols-4 overflow-hidden rounded bg-primary-foreground p-8 shadow-lg"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <Heading variant="h5">{testSeries.total_questions}</Heading>
          <span className="text-xs text-center">Questions</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <Heading variant="h5">{totalDuration > 0 ? `${totalDuration}m` : "—"}</Heading>
          <span className="text-xs text-center">Duration</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <Heading variant="h5">{testSeries.passing_percentage}%</Heading>
          <span className="text-xs text-center">Pass Score</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Heading variant="h5">
            {testSeries.shuffle_questions ? "Shuffled" : "Ordered"}
          </Heading>
          <span className="text-xs text-center">Questions</span>
        </div>
      </div>
    </section>
  )
}

export default TestSeriesDetailHeader
