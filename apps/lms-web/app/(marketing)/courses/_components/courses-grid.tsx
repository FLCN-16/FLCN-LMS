import { Button } from "@flcn-lms/ui/components/button"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import CourseCard from "@/components/card/course"

interface Course {
  id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  imageUrl: string
  category?: string
  level?: string
}

interface CoursesGridProps {
  courses: Course[]
  isLoading?: boolean
}

export default function CoursesGrid({ courses, isLoading }: CoursesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-border/30 bg-muted/30 p-4"
          >
            <div className="mb-4 h-40 w-full rounded-lg bg-muted" />
            <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-lg border border-border/30 bg-muted/10 py-12">
        <div className="space-y-4 text-center">
          <Heading variant="h3" className="text-lg">
            No courses found
          </Heading>
          <Text className="text-muted-foreground">
            Try adjusting your filters or search terms
          </Text>
          <Button variant="outline" size="sm">
            Clear All Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Result count */}
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <Text className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{courses.length}</span> courses
        </Text>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            slug={course.slug}
            price={course.price}
            discountPrice={course.discountPrice}
            imageUrl={course.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}
