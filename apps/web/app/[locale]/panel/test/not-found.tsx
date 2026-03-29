import { useTranslations } from "next-intl"

function TestNotFound() {
  const t = useTranslations("test")
  return <div>{t("notFound")}</div>
}

export default TestNotFound
