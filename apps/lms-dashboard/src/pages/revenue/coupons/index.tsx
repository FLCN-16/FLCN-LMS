import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

import { useCouponsList, useDeleteCoupon } from "@/queries/coupons"

export default function RevenueCouponsPage() {
  const { data: coupons = [], isLoading } = useCouponsList()
  const deleteMutation = useDeleteCoupon()

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteMutation.mutate({ id })
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  function isExpired(validUntil: string) {
    return new Date(validUntil) < new Date()
  }

  return (
    <>
      <Helmet>
        <title>Coupons & Discounts — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Coupons & Discounts</h2>
            <p className="text-sm text-muted-foreground">
              {coupons.length} coupons
            </p>
          </div>

          <Button size="sm" asChild>
            <Link to="/revenue/coupons/new">
              <IconPlus className="size-4" />
              New Coupon
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No coupons are available yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-mono">
                        {coupon.code}
                      </CardTitle>
                      {coupon.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {coupon.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          coupon.active && !isExpired(coupon.validUntil)
                            ? "default"
                            : isExpired(coupon.validUntil)
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {coupon.active && !isExpired(coupon.validUntil)
                          ? "Active"
                          : isExpired(coupon.validUntil)
                            ? "Expired"
                            : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Discount</p>
                      <p className="font-medium">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue.toFixed(2)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Used</p>
                      <p className="font-medium">
                        {coupon.usageCount}/{coupon.usageLimit ?? "∞"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid From</p>
                      <p className="font-medium">{formatDate(coupon.validFrom)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className="font-medium">{formatDate(coupon.validUntil)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/revenue/coupons/${coupon.id}/edit`}>
                        <IconPencil className="size-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <IconTrash className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
