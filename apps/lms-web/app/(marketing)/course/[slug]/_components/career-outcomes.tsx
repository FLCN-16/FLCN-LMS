import { Badge } from "@flcn-lms/ui/components/badge"

interface CourseCareerOutcomesProps {
  careerOutcomes: string[]
  companies?: string[]
}

export default function CourseCareerOutcomesSection({
  careerOutcomes,
  companies,
}: CourseCareerOutcomesProps) {
  if (careerOutcomes.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Career Outcomes</h2>
        <p className="mt-1 text-muted-foreground">
          Skills that open doors to real opportunities
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {careerOutcomes.map((outcome, index) => (
          <Badge key={index} variant="secondary">
            {outcome}
          </Badge>
        ))}
      </div>

      {companies && companies.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Hiring companies include:
          </span>
          {companies.map((company, index) => (
            <Badge key={index} variant="outline">
              {company}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
