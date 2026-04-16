import Image from "next/image"

import { type PublicInstructor } from "@/fetchers/marketing"

interface CourseInstructorSectionProps {
  instructor?: PublicInstructor
}

export default function CourseInstructorSection({ instructor }: CourseInstructorSectionProps) {
  if (!instructor) {
    return (
      <div className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold">About the Instructor</h2>
        <p className="text-muted-foreground">Instructor information not available.</p>
      </div>
    )
  }

  const fullName = `${instructor.first_name} ${instructor.last_name}`
  const initials = `${instructor.first_name?.[0] ?? ""}${instructor.last_name?.[0] ?? ""}`

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">About the Instructor</h2>
      </div>

      <div className="flex gap-6 md:gap-8">
        {/* Instructor avatar */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          {instructor.profile_picture_url ? (
            <Image
              src={instructor.profile_picture_url}
              alt={fullName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-semibold">{fullName}</h3>
            <p className="text-sm capitalize text-muted-foreground">{instructor.role}</p>
          </div>

          <p className="leading-relaxed text-foreground">
            Expert instructor with hands-on industry experience. Committed to delivering
            high-quality learning through practical, real-world content.
          </p>
        </div>
      </div>
    </div>
  )
}
