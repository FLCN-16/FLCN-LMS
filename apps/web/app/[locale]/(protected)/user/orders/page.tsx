import { useTranslations } from "next-intl"

function OrdersPage() {
  const t = useTranslations("panel.user")
  return <div>{t("orders")}</div>
}

export default OrdersPage
