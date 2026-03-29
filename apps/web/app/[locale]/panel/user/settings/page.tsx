import { useTranslations } from "next-intl"

function UserSettingsPage() {
  const t = useTranslations("panel.user")
  return <div>{t("settings")}</div>
}

export default UserSettingsPage
