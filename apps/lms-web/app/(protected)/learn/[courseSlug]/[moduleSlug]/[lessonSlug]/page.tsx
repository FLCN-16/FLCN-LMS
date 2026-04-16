import dynamic from "next/dynamic"
import Link from "next/link"

import { AspectRatio } from "@flcn-lms/ui/components/aspect-ratio"
import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"

import { getCourseWithModules } from "@/fetchers/course"

const PlayerComponent = dynamic(() => import("@/components/player"), {
  loading: () => (
    <div className="w-full aspect-video bg-muted/20 animate-pulse rounded-lg" />
  ),
})

interface UserCourseLessonPageProps {
  params: Promise<{
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
  }>
}

async function UserCourseLessonPage({ params }: UserCourseLessonPageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params

  const course = await getCourseWithModules(courseSlug)
  const module = course.modules?.find((m) => m.slug === moduleSlug)
  const lesson = module?.lessons?.find((l) => l.slug === lessonSlug)

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="text-muted-foreground">
          The lesson you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href={`/learn/${courseSlug}`}>Back to Course</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Main video player and content */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/learn/${courseSlug}`} className="hover:text-foreground">
            {course.title}
          </Link>
          <span>/</span>
          <span>{module?.title}</span>
          <span>/</span>
          <span>{lesson.title}</span>
        </div>

        {/* Video Player */}
        <div>
          <AspectRatio ratio={16 / 9}>
            {lesson.videoUrl ? (
              <PlayerComponent src={lesson.videoUrl} />
            ) : (
              <div className="flex items-center justify-center bg-muted h-full">
                <p className="text-muted-foreground">No video available</p>
              </div>
            )}
          </AspectRatio>
        </div>

        {/* Lesson details */}
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          {lesson.videoDurationSecs && (
            <p className="text-sm text-muted-foreground mb-4">
              Duration: {Math.round(lesson.videoDurationSecs / 60)} minutes
            </p>
          )}
          {lesson.textContent && (
            <div className="prose dark:prose-invert max-w-none">
              {lesson.textContent}
            </div>
          )}
        </Card>
      </div>

      {/* Sidebar - Lesson navigation */}
      <aside className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Lesson Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Module</p>
              <p className="font-medium">{module?.title}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{lesson.type.toLowerCase()}</p>
            </div>
            {lesson.videoDurationSecs && (
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {Math.round(lesson.videoDurationSecs / 60)} min
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Module navigation */}
        {module?.lessons && module.lessons.length > 1 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Lessons in {module.title}</h3>
            <div className="space-y-1">
              {module.lessons.map((l) => (
                <Link
                  key={l.id}
                  href={`/learn/${courseSlug}/${module.slug}/${l.slug}`}
                  className={`block p-2 rounded text-sm transition-colors ${
                    l.id === lesson.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.title}
                </Link>
              ))}
            </div>
          </Card>
        )}
      </aside>
    </div>
  )
}

export default UserCourseLessonPage
