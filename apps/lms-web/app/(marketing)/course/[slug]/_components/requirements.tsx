import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface CourseRequirementsProps {
  requirements: string[]
}

export default function CourseRequirementsSection({
  requirements,
}: CourseRequirementsProps) {
  if (requirements.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Requirements</h2>
      </div>

      <ul className="flex flex-col gap-3">
        {requirements.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground"
            />
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
