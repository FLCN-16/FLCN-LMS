"use client"

import { Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Text } from "@flcn-lms/ui/components/typography"

import { useCart } from "@/lib/cart-store"
import formatPrice from "@/lib/format-price"

function CheckoutSummary() {
  const { items, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>
            <h2>Order Items</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Text className="text-muted-foreground">Your cart is empty</Text>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h2>Order Items ({items.length})</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-border p-4"
          >
            {/* Item Image */}
            <div className="flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={96}
                height={96}
                className="rounded-md object-cover"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <div>
                  <Text className="font-semibold line-clamp-2">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground capitalize">
                    {item.type === "test_series" ? "Test Series" : "Course"}
                  </Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text className="text-lg font-bold">
                    {formatPrice(item.price)}
                  </Text>
                  <div className="flex items-center gap-2">
                    {item.quantity > 1 && (
                      <Text className="text-sm text-muted-foreground">
                        x {item.quantity}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <div className="flex items-end">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default CheckoutSummary
