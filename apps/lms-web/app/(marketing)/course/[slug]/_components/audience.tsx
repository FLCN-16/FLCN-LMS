import { Mortarboard01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface CourseAudienceProps {
  targetAudience: string[]
}

export default function CourseAudienceSection({
  targetAudience,
}: CourseAudienceProps) {
  if (targetAudience.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Who This Course Is For</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {targetAudience.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={Mortarboard01Icon}
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
            />
            <span className="text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
