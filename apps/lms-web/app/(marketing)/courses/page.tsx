import { getMarketingCourses, getMarketingCategories, type MarketingCourseList } from "@/fetchers/marketing"

import CoursesHeader from "./_components/courses-header"
import CoursesClient from "./_components/courses-client"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  let courses: MarketingCourseList[] = []
  let categories: string[] = []

  try {
    const [coursesResult, categoriesResult] = await Promise.all([
      getMarketingCourses({ limit: 100 }),
      getMarketingCategories(),
    ])
    courses = coursesResult.data
    categories = categoriesResult.map((c) => c.name)
  } catch {
    // Render with empty state on API failure
  }

  return (
    <main className="flex flex-col">
      <CoursesHeader />
      <CoursesClient initialCourses={courses} categories={categories} />
    </main>
  )
}
