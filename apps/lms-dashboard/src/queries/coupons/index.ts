import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

export interface Coupon {
  id: string
  tenantId: string
  code: string
  description?: string | null
  discountType: "percentage" | "fixed"
  discountValue: number
  maxDiscount?: number | null
  usageLimit?: number | null
  usageCount: number
  minPurchaseAmount?: number | null
  validFrom: string
  validUntil: string
  active: boolean
  courseIds?: string[] | null
  createdAt: string
  updatedAt: string
}

export const coupons = router("coupons", {
  list: router.query({
    fetcher: async (): Promise<Coupon[]> => {
      const response = await fetch.get<Coupon[]>("/api/v1/coupons")
      return response.data
    },
  }),

  active: router.query({
    fetcher: async (): Promise<Coupon[]> => {
      const response = await fetch.get<Coupon[]>("/api/v1/coupons/active")
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<Coupon> => {
      const response = await fetch.get<Coupon>(
        `/api/v1/coupons/${variables.id}`
      )
      return response.data
    },
  }),

  validate: router.mutation({
    mutationFn: async (variables: { code: string }): Promise<any> => {
      const response = await fetch.post("/api/v1/coupons/validate", variables)
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: any): Promise<Coupon> => {
      const response = await fetch.post<Coupon>(
        "/api/v1/coupons",
        variables
      )
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: any
    }): Promise<Coupon> => {
      const response = await fetch.patch<Coupon>(
        `/api/v1/coupons/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/v1/coupons/${variables.id}`)
    },
  }),
})

export const useCouponsList = coupons.list.useQuery
export const useActiveCoupons = coupons.active.useQuery
export const useCouponDetail = coupons.byId.useQuery
export const useValidateCoupon = coupons.validate.useMutation
export const useCreateCoupon = coupons.add.useMutation
export const useUpdateCoupon = coupons.update.useMutation
export const useDeleteCoupon = coupons.remove.useMutation
