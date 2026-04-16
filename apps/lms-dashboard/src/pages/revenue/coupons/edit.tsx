import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import { Loader } from "@/components/loader"

import { useCouponDetail, useUpdateCoupon } from "@/queries/coupons"
import { CouponForm } from "./coupon-form"

export default function EditCouponPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: coupon, isLoading } = useCouponDetail({ id: id! }, { enabled: !!id })
  const updateMutation = useUpdateCoupon()

  const handleSubmit = (data: any) => {
    if (!id) return
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate("/revenue/coupons")
        },
      }
    )
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Helmet>
        <title>Edit Coupon — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/revenue/coupons">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Coupon</h2>
            <p className="text-sm text-muted-foreground">
              Update the details of your coupon
            </p>
          </div>
        </div>

        {updateMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to update coupon. Please try again.
          </p>
        )}

        <CouponForm
          defaultValues={coupon}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Update Coupon"
        />
      </div>
    </>
  )
}
