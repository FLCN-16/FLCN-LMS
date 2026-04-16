import Link from "next/link"
import { Clock, Target, BookOpen, DollarSign, Lock } from "lucide-react"

import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import { cn } from "@flcn-lms/ui/lib/utils"

interface TestSeriesCardProps {
  id: string
  title: string
  slug: string
  description: string
  totalQuestions: number
  pricingType: "free" | "paid"
  price?: number
  passingPercentage: number
  isPublished: boolean
}

function TestSeriesCard({
  id,
  title,
  slug,
  description,
  totalQuestions,
  pricingType,
  price,
  passingPercentage,
  isPublished,
}: TestSeriesCardProps) {
  const isFree = pricingType === "free"
  const displayPrice = isFree ? "Free" : `₹${price?.toFixed(2)}`

  return (
    <div
      className={cn(
        "group relative flex max-w-sm flex-col overflow-hidden rounded-lg border transition-all duration-200",
        "hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-700",
        "bg-white dark:bg-neutral-950"
      )}
    >
      {/* Header with Badge */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex-1">
          <Heading variant="h3" className="line-clamp-2 text-sm font-bold leading-snug">
            {title}
          </Heading>
          <Text className="mt-1.5 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </Text>
        </div>
        {!isFree && (
          <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-950">
            <DollarSign className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Paid
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        {/* Metadata Section */}
        <div className="space-y-3">
          {/* Questions */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="min-w-0">
              <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {totalQuestions} Questions
              </Text>
            </div>
          </div>

          {/* Passing Score */}
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div className="min-w-0">
              <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {passingPercentage}% to Pass
              </Text>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            {isPublished ? (
              <>
                <Clock className="h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  Available Now
                </Text>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Coming Soon
                </Text>
              </>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="space-y-3 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          {/* Price */}
          <div className="flex items-center justify-between">
            <Text className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {isFree ? "Free Access" : "Price"}
            </Text>
            <Text className={cn("text-lg font-bold", isFree ? "text-green-600 dark:text-green-400" : "text-neutral-900 dark:text-white")}>
              {displayPrice}
            </Text>
          </div>

          {/* Buttons */}
          {isPublished ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="flex-1 rounded"
              >
                <Link href={`/test-series/${slug}`}>Preview</Link>
              </Button>
              <Button size="lg" asChild className="flex-1 rounded">
                <Link href={`/test-series/${slug}/attempt`}>Start Test</Link>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="lg" disabled className="w-full rounded">
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestSeriesCard
