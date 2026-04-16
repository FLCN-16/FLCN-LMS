import Link from "next/link"

import { Star, Users } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@flcn-lms/ui/components/avatar"
import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Separator } from "@flcn-lms/ui/components/separator"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import { cn } from "@flcn-lms/ui/lib/utils"

import { type MarketingCourseDetail } from "@/fetchers/marketing"
import formatPrice from "@/lib/format-price"

interface CourseDetailHeaderProps {
  course: MarketingCourseDetail
}

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
  const instructorName = course.instructor
    ? `${course.instructor.first_name} ${course.instructor.last_name}`
    : "Instructor"

  const instructorInitials = course.instructor
    ? `${course.instructor.first_name?.[0] ?? ""}${course.instructor.last_name?.[0] ?? ""}`
    : "IN"

  const highlights = course.highlights?.slice(0, 5) ?? []

  return (
    <section
      id="course-detail-header"
      className="relative mb-18 bg-gray-100 py-12 pb-26 dark:bg-black"
    >
      <div className="container grid grid-cols-12">
        <div className="col-span-8 flex flex-col gap-y-3">
          {/* Highlight pills */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight, i) => (
                <Badge key={i} variant="secondary">
                  {highlight}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <Heading variant="h1" className="font-heading">
            {course.title}
          </Heading>

          {/* Short description */}
          {course.short_description && (
            <p className="text-lg text-muted-foreground">
              {course.short_description}
            </p>
          )}

          {/* Rating row */}
          {(course.average_rating ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Star}
                className="h-5 w-5 fill-accent text-accent"
              />
              <span className="font-semibold">
                {course.average_rating!.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({course.review_count?.toLocaleString() ?? 0} reviews)
              </span>
            </div>
          )}

          {/* Enrolled row */}
          {(course.total_enrolled ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Users}
                className="h-5 w-5 text-muted-foreground"
              />
              <span className="text-sm text-muted-foreground">
                {course.total_enrolled!.toLocaleString()} students enrolled
              </span>
            </div>
          )}

          <div className="inline-flex flex-col items-start gap-y-4">
            {/* Instructor byline */}
            <div className="flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src={course.instructor?.profile_picture_url} />
                <AvatarFallback>{instructorInitials}</AvatarFallback>
              </Avatar>

              {course.instructor ? (
                <Link href={`/instructors/${course.instructor.id}`}>
                  <Heading variant="h6" className="font-light">
                    {instructorName}
                  </Heading>
                </Link>
              ) : (
                <Heading variant="h6" className="font-light">
                  {instructorName}
                </Heading>
              )}

              <Separator orientation="vertical" />

              <Heading variant="h6" className="font-light">
                <strong className="font-semibold">
                  {course.max_students > 0
                    ? `Up to ${course.max_students} students`
                    : "Open enrollment"}
                </strong>
              </Heading>
            </div>

            {/* Metadata pill row */}
            <div className="flex flex-wrap gap-2">
              {course.level && (
                <Badge variant="outline">
                  {titleCase(course.level)} Level
                </Badge>
              )}
              {course.language && (
                <Badge variant="outline">{course.language}</Badge>
              )}
              {course.certificate_included && (
                <Badge variant="outline">Certificate</Badge>
              )}
              {(course.estimated_hours ?? 0) > 0 && (
                <Badge variant="outline">
                  {course.estimated_hours}h content
                </Badge>
              )}
            </div>

            {/* Price + enroll */}
            <div className="inline-flex items-center gap-x-3">
              <Text className="font-semibold">Starts from</Text>
              <div className="inline-flex items-center gap-x-3 font-mono">
                <Text className="text-2xl font-semibold text-green-600">
                  {formatPrice(course.price)}
                </Text>
              </div>
            </div>

            <Button size="course-enroll" asChild>
              <Link href={`/checkout?courseId=${course.id}`}>Enroll Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 container grid translate-y-1/2 transform grid-cols-4 overflow-hidden rounded bg-primary-foreground p-8 shadow-lg"
        )}
      >
        <div className="flex flex-col items-center">
          <Heading variant="h5">Online Course</Heading>
          <span className="font-xs text-center">Learn from anywhere</span>
        </div>

        <div className="flex flex-col items-center">
          <Heading variant="h5">
            {course.level ? `${titleCase(course.level)} Level` : "All Levels"}
          </Heading>
          <span className="font-xs text-center">Skill level</span>
        </div>

        <div className="flex flex-col items-center">
          <Heading variant="h5">{course.language ?? "English"}</Heading>
          <span className="font-xs text-center">Course language</span>
        </div>

        <div className="flex flex-col items-center">
          <Heading variant="h5">
            {course.certificate_included
              ? "Certificate Included"
              : "Certificate"}
          </Heading>
          <span className="font-xs text-center">Upon completion</span>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailHeader
