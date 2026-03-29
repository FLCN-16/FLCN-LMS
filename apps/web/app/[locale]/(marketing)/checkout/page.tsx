import { useTranslations } from "next-intl"

async function CheckoutPage() {
  const t = useTranslations()
  return <div>{t("checkout")}</div>
}

export default CheckoutPage
