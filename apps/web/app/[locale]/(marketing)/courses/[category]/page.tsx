import { useTranslations } from "next-intl"

interface CourseByCategoryPageParams {
  params: Promise<{ category: string }>
}

async function CoursesByCategoryPage({ params }: CourseByCategoryPageParams) {
  const { category } = await params
  const t = useTranslations()

  return <div>{t("coursesByCategory", { category })}</div>
}

export default CoursesByCategoryPage
