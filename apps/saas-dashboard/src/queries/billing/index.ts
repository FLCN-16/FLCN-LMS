import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface BillingRecord {
  id: string
  customerId: string
  planId: string
  status: "active" | "paused" | "cancelled"
  amount: number
  currency: string
  billingCycle: "monthly" | "yearly"
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}

export interface CreateBillingInput {
  customerId: string
  planId: string
  billingCycle: "monthly" | "yearly"
}

export interface UpdateBillingInput {
  status?: "active" | "paused" | "cancelled"
  planId?: string
}

// Query: Get all billing records
export const useBillingRecords = createQuery<BillingRecord[]>({
  queryKey: ["billing"],
  fetcher: async () => {
    const response = await fetch.get<BillingRecord[]>("/v1/billing")
    return response.data
  },
})

// Query: Get single billing record
export const useBillingRecord = createQuery<BillingRecord, { id: string }>({
  queryKey: ["billing", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<BillingRecord>(`/v1/billing/${id}`)
    return response.data
  },
})

// Mutation: Create billing record
export const useCreateBilling = createMutation({
  mutationFn: async (data: CreateBillingInput) => {
    const response = await fetch.post<BillingRecord>("/v1/billing", data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["billing"] }
  },
})

// Mutation: Update billing record
export const useUpdateBilling = createMutation({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string
    data: UpdateBillingInput
  }) => {
    const response = await fetch.patch<BillingRecord>(`/v1/billing/${id}`, data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["billing"] }
  },
})
