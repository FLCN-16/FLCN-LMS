import { Check } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function CourseLearningSection() {
  const objectives = [
    "Master core concepts and fundamentals",
    "Build practical, real-world projects",
    "Understand industry best practices",
    "Develop problem-solving skills",
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">What You'll Learn</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {objectives.map((objective, index) => (
          <div key={index} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={Check}
              className="mt-1 h-5 w-5 flex-shrink-0 text-accent"
            />
            <span className="text-foreground">{objective}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
