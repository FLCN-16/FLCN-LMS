import CourseCard from "@/components/card/course"
import { type MarketingCourseList } from "@/fetchers/marketing"

interface CourseRelatedSectionProps {
  courses: MarketingCourseList[]
}

export default function CourseRelatedSection({ courses }: CourseRelatedSectionProps) {
  if (!courses || courses.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Related Courses</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Continue your learning journey with these related courses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            slug={course.slug}
            price={course.price}
            imageUrl={
              course.thumbnail_url ||
              "https://placehold.co/320x180/18181b/ffffff?text=Course"
            }
            level={course.level}
            estimatedHours={course.estimated_hours}
            totalEnrolled={course.total_enrolled}
            averageRating={course.average_rating}
            reviewCount={course.review_count}
            certificateIncluded={course.certificate_included}
            instructorName={course.instructor ? `${course.instructor.first_name} ${course.instructor.last_name}` : undefined}
            isFeatured={course.is_featured}
          />
        ))}
      </div>
    </div>
  )
}
