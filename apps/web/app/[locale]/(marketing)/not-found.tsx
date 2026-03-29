import { useTranslations } from "next-intl"

function NotFound() {
  const t = useTranslations("notFound")
  return <div>{t("marketing")}</div>
}

export default NotFound
