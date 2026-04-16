"use client"

import { useState } from "react"

import { Check } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface CourseLearningProps {
  whatYouLearn?: string[]
}

const DEFAULT_OBJECTIVES = [
  "Master core concepts and fundamentals",
  "Build practical, real-world projects",
  "Understand industry best practices",
  "Develop problem-solving skills",
]

const SHOW_MORE_THRESHOLD = 6

export default function CourseLearningSection({
  whatYouLearn,
}: CourseLearningProps) {
  const [showAll, setShowAll] = useState(false)

  const objectives =
    whatYouLearn && whatYouLearn.length > 0 ? whatYouLearn : DEFAULT_OBJECTIVES

  const hasMore = objectives.length > SHOW_MORE_THRESHOLD
  const visibleObjectives =
    hasMore && !showAll ? objectives.slice(0, SHOW_MORE_THRESHOLD) : objectives

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">What You'll Learn</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleObjectives.map((objective, index) => (
          <div key={index} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={Check}
              className="mt-1 h-5 w-5 flex-shrink-0 text-accent"
            />
            <span className="text-foreground">{objective}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="self-start text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {showAll
            ? "Show less"
            : `Show ${objectives.length - SHOW_MORE_THRESHOLD} more`}
        </button>
      )}
    </div>
  )
}
