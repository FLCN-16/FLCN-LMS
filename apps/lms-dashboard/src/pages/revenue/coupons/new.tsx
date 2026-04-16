import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"

import { useCreateCoupon } from "@/queries/coupons"

import { CouponForm } from "./coupon-form"

export default function NewCouponPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCoupon()

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/revenue/coupons")
      },
    })
  }

  return (
    <>
      <Helmet>
        <title>New Coupon — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/revenue/coupons">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Coupon</h2>
            <p className="text-sm text-muted-foreground">
              Create a new discount coupon
            </p>
          </div>
        </div>

        {createMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to create coupon. Please try again.
          </p>
        )}

        <CouponForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Create Coupon"
        />
      </div>
    </>
  )
}
