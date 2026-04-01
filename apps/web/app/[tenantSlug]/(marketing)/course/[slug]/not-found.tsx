import { useTranslations } from "next-intl"

function CourseNotFound() {
  const t = useTranslations("course")
  return <div>{t("notFound")}</div>
}

export default CourseNotFound
