import { useTranslations } from "next-intl"

function UserProfilePage() {
  const t = useTranslations("panel.user")
  return <div>{t("profile")}</div>
}

export default UserProfilePage
