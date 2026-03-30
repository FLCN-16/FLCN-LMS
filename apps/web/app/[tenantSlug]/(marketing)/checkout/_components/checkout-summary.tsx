import Image from "next/image"

import type { CartItem } from "@flcn-lms/types"
import { Text } from "@flcn-lms/ui/components/typography"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@flcn-lms/ui/components/card"

import formatPrice from "@/lib/format-price"

function CheckoutSummary({ id, title, price, imageUrl }: CartItem) {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h2>Checkout Summary</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-x-2" data-item-id={id}>
          <Image
            src={imageUrl}
            className="pointer-events-none rounded-sm"
            alt="Course"
            width={240}
            height={120}
          />

          <div className="flex flex-col p-2">
            <h3 className="line-clamp-2">{title}</h3>
            <h6>Valid till: 23rd July 2028</h6>

            <div className="flex items-center gap-x-2">
              <Text className="text-lg font-semibold">
                {price && formatPrice(price)}
              </Text>
              <Text className="text-sm line-through opacity-60">
                {formatPrice(price)}
              </Text>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckoutSummary
