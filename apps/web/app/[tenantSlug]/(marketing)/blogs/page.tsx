import { getTranslations } from "next-intl/server"

async function BlogsPage() {
  const t = await getTranslations()
  return <div>{t("blogs")}</div>
}

export default BlogsPage
