import { type MarketingCourseDetail } from "@/fetchers/marketing"

interface CourseOverviewSectionProps {
  course: MarketingCourseDetail
}

export default function CourseOverviewSection({ course }: CourseOverviewSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">About This Course</h2>
        <p className="leading-relaxed text-muted-foreground">
          {course.description || "Course details coming soon."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Prerequisites</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Basic understanding of fundamentals</li>
            <li>• Willingness to learn</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Target Audience</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Beginners looking to learn new skills</li>
            <li>• Professionals seeking advancement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
