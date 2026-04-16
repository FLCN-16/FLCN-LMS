export default function CourseOverviewSection() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">About This Course</h2>
        <p className="text-muted-foreground leading-relaxed">
          Course description and overview content will be displayed here. This section
          provides students with a comprehensive understanding of what the course covers
          and the key topics they'll explore.
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
