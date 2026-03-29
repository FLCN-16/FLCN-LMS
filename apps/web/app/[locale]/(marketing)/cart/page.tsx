import { useTranslations } from "next-intl"

async function CartPage() {
  const t = useTranslations()
  return <div>{t("cart")}</div>
}

export default CartPage
