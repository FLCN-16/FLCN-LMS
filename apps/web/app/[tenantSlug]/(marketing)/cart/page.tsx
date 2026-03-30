import { getTranslations } from "next-intl/server"

async function CartPage() {
  const t = await getTranslations()
  return <div>{t("cart")}</div>
}

export default CartPage
