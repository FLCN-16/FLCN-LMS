"use client"

import Link from "next/link"
import { useState } from "react"
import { Loader2, X, LogIn } from "lucide-react"

import { Button } from "@flcn-lms/ui/components/button"
import { Input } from "@flcn-lms/ui/components/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Text, Heading } from "@flcn-lms/ui/components/typography"

import { useCart } from "@/lib/cart-store"
import { validateCoupon } from "@/fetchers/orders"
import formatPrice from "@/lib/format-price"

interface CheckoutTotalsProps {
  isAuthenticated?: boolean
}

function CheckoutTotals({ isAuthenticated = false }: CheckoutTotalsProps) {
  const { getSubtotal, couponCode, couponDiscount, setCoupon } = useCart()
  const [couponInput, setCouponInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = getSubtotal()
  const total = Math.max(0, subtotal - couponDiscount)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setError("Enter a coupon code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await validateCoupon({
        code: couponInput,
        order_value: subtotal,
      })
      setCoupon(result.code, result.discount)
      setCouponInput("")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid coupon code"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCoupon(null, 0)
  }

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h3>Order Summary</h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Subtotal */}
        <div className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <Text className="text-sm text-muted-foreground">Subtotal</Text>
            <Text className="font-semibold">{formatPrice(subtotal)}</Text>
          </div>

          {/* Discount */}
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between">
              <Text className="text-sm text-green-600 dark:text-green-400">
                Discount ({couponCode})
              </Text>
              <Text className="font-semibold text-green-600 dark:text-green-400">
                -{formatPrice(couponDiscount)}
              </Text>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between">
          <Text className="text-lg font-semibold">Total</Text>
          <Text className="text-2xl font-bold">{formatPrice(total)}</Text>
        </div>

        {isAuthenticated ? (
          <>
            {/* Coupon Section */}
            <div className="space-y-3 border-t pt-4">
              <Text className="text-sm font-semibold">Have a coupon code?</Text>

              {couponCode ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-950">
                  <div>
                    <Text className="text-sm font-medium text-green-900 dark:text-green-100">
                      {couponCode}
                    </Text>
                    <Text className="text-xs text-green-700 dark:text-green-300">
                      {formatPrice(couponDiscount)} discount applied
                    </Text>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleRemoveCoupon}
                    className="h-8 w-8 text-green-900 hover:bg-green-100 dark:text-green-100 dark:hover:bg-green-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value)
                      setError(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApplyCoupon()
                      }
                    }}
                    disabled={isLoading}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isLoading || !couponInput.trim()}
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <Text className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </Text>
              )}
            </div>

            {/* Checkout Button */}
            <Button
              size="lg"
              className="w-full"
              disabled={subtotal === 0}
            >
              Proceed to Checkout
            </Button>
          </>
        ) : (
          <>
            {/* Login Prompt */}
            <div className="space-y-4 border-t pt-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 space-y-3">
                <div className="flex gap-3">
                  <LogIn className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <Heading variant="h5" className="text-base">
                      Sign in to continue
                    </Heading>
                    <Text className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Please log in to your account to complete your purchase and apply coupon codes.
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>

              <Text className="text-xs text-center text-muted-foreground">
                Don't have an account? Sign up now to get started.
              </Text>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CheckoutTotals
