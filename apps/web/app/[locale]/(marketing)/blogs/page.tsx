import { useTranslations } from "next-intl"

async function BlogsPage() {
  const t = useTranslations()
  return <div>{t("blogs")}</div>
}

export default BlogsPage
