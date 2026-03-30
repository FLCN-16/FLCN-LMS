import CourseCard from "@/components/card/course"
import { getTranslations } from "next-intl/server"

interface CourseByCategoryPageParams {
  params: Promise<{ category: string }>
}

async function CoursesByCategoryPage({ params }: CourseByCategoryPageParams) {
  const { category } = await params
  const t = await getTranslations()

  return (
    <div>
      <CourseCard />
    </div>
  )
}

export default CoursesByCategoryPage
