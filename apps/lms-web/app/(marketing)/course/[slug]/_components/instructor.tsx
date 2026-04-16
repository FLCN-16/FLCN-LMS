export default function CourseInstructorSection() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">About the Instructor</h2>
      </div>

      <div className="flex gap-6 md:gap-8">
        {/* Instructor Avatar Placeholder */}
        <div className="h-32 w-32 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary to-accent" />

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-semibold">Instructor Name</h3>
            <p className="text-sm text-muted-foreground">Course Title • Specialization</p>
          </div>

          <p className="text-foreground leading-relaxed">
            Brief bio about the instructor's experience, background, and expertise.
            This section should highlight their credentials and achievements in the field.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-accent">50+</div>
              <p className="text-xs text-muted-foreground">Courses Published</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">500k+</div>
              <p className="text-xs text-muted-foreground">Students Taught</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">4.9/5</div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
