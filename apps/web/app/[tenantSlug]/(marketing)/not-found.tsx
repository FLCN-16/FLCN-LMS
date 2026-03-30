import { getTranslations } from "next-intl/server"

async function NotFound() {
  const t = await getTranslations("notFound")
  return <div>{t("marketing")}</div>
}

export default NotFound
