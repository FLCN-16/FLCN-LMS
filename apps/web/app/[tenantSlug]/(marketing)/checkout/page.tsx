import { getTranslations } from "next-intl/server"
import dynamic from "next/dynamic"

import metaObject from "@/lib/meta-config"

const CheckoutSummary = dynamic(() => import("./_components/checkout-summary"))
const CheckoutPackages = dynamic(
  () => import("./_components/checkout-packages")
)
const CheckoutTotals = dynamic(() => import("./_components/checkout-totals"))
const CheckoutUserDetails = dynamic(
  () => import("./_components/checkout-user-details")
)

export const metadata = metaObject({
  title: "Checkout",
  description: "Checkout page for [SITE_NAME]",
})

async function CheckoutPage() {
  const t = await getTranslations("checkout")
  return (
    <main className="container space-y-6 py-6">
      <h1>{t("title")}</h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-y-4">
          <CheckoutSummary
            title="Financial Services"
            price={1}
            imageUrl="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop"
          />

          <CheckoutPackages />
        </div>

        <aside className="col-span-4 flex flex-col gap-y-4">
          <CheckoutTotals />
          <CheckoutUserDetails />
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
