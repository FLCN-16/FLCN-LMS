import Link from "next/link"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

async function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
            <p className="text-muted-foreground">
              Add courses or test series to your cart and proceed to checkout
            </p>
          </div>

          {/* Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Explore our courses and test series to get started
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button asChild variant="outline">
                  <Link href="/course">Browse Courses</Link>
                </Button>
                <Button asChild>
                  <Link href="/test-series">Browse Test Series</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 rounded-lg bg-muted/50 p-6">
            <h3 className="mb-3 font-semibold">💡 Helpful Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Browse our{" "}
                <Link href="/course" className="font-medium underline hover:text-foreground">
                  courses
                </Link>{" "}
                or{" "}
                <Link href="/test-series" className="font-medium underline hover:text-foreground">
                  test series
                </Link>{" "}
                to find content that matches your needs
              </li>
              <li>• Click "Add to Cart" on any course or test series</li>
              <li>• Review your items before proceeding to checkout</li>
              <li>• Apply coupon codes at checkout to get discounts</li>
              <li>• Complete payment to gain instant access</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CartPage
