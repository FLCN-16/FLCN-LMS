import dynamic from "next/dynamic"

const CheckoutSummary = dynamic(() => import("./_components/checkout-summary"))
const CheckoutPackages = dynamic(
  () => import("./_components/checkout-packages")
)
const CheckoutTotals = dynamic(() => import("./_components/checkout-totals"))
const CheckoutUserDetails = dynamic(
  () => import("./_components/checkout-user-details")
)

async function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container grid gap-8 px-4 py-12 md:grid-cols-3">
        {/* Left Column - Order Items */}
        <div className="space-y-6 md:col-span-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="mt-2 text-muted-foreground">
              Review your items and complete your purchase
            </p>
          </div>

          {/* Checkout Steps */}
          <div className="space-y-6">
            <CheckoutUserDetails />
            <CheckoutPackages />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <CheckoutSummary />
          <CheckoutTotals />
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
