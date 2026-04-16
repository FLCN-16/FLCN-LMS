import dynamic from "next/dynamic"

const CheckoutSummary = dynamic(() => import("./_components/checkout-summary"), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse rounded-lg" />,
})

const CheckoutPackages = dynamic(
  () => import("./_components/checkout-packages"),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse rounded-lg" />,
  }
)

const CheckoutTotals = dynamic(() => import("./_components/checkout-totals"), {
  loading: () => <div className="h-48 bg-muted/20 animate-pulse rounded-lg" />,
})

const CheckoutUserDetails = dynamic(
  () => import("./_components/checkout-user-details"),
  {
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />,
  }
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
