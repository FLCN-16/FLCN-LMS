import { useTranslations } from "next-intl"

async function CoursesPage() {
  const t = useTranslations()
  return <div>{t("courses")}</div>
}

export default CoursesPage
