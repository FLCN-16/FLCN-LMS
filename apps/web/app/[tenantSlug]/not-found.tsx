import { getTranslations } from "next-intl/server"

async function TenantNotFound() {
  const t = await getTranslations("notFound")
  return <div>{t("notFound")}</div>
}

export default TenantNotFound
