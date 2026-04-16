import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface Refund {
  id: string
  invoiceId: string
  amount: number
  currency: string
  status: "pending" | "approved" | "rejected" | "processed" | "failed"
  reason?: string
  requestedAt: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateRefundInput {
  invoiceId: string
  amount: number
  reason?: string
}

export interface ProcessRefundInput {
  status: "approved" | "rejected"
  notes?: string
}

export interface RefundStats {
  total: number
  pending: number
  approved: number
  rejected: number
  processed: number
  totalAmount: number
}

// Query: Get all refunds
export const useRefunds = createQuery<Refund[]>({
  queryKey: ["refunds"],
  fetcher: async () => {
    const response = await fetch.get<Refund[]>("/v1/refunds")
    return response.data
  },
})

// Query: Get single refund
export const useRefund = createQuery<Refund, { id: string }>({
  queryKey: ["refunds", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<Refund>(`/v1/refunds/${id}`)
    return response.data
  },
})

// Query: Get refund stats
export const useRefundStats = createQuery<RefundStats>({
  queryKey: ["refunds", "stats"],
  fetcher: async () => {
    const response = await fetch.get<RefundStats>("/v1/refunds/stats")
    return response.data
  },
})

// Mutation: Create refund
export const useCreateRefund = createMutation({
  mutationFn: async (data: CreateRefundInput) => {
    const response = await fetch.post<Refund>("/v1/refunds", data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["refunds"] }
  },
})

// Mutation: Approve refund
export const useApproveRefund = createMutation({
  mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
    const response = await fetch.post<Refund>(`/v1/refunds/${id}/approve`, {
      notes,
    })
    return response.data
  },
  onSuccess: () => {
    return { id: ["refunds"] }
  },
})

// Mutation: Reject refund
export const useRejectRefund = createMutation({
  mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
    const response = await fetch.post<Refund>(`/v1/refunds/${id}/reject`, {
      notes,
    })
    return response.data
  },
  onSuccess: () => {
    return { id: ["refunds"] }
  },
})

// Mutation: Process refund
export const useProcessRefund = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.post<Refund>(`/v1/refunds/${id}/process`, {})
    return response.data
  },
  onSuccess: () => {
    return { id: ["refunds"] }
  },
})

// Mutation: Retry refund
export const useRetryRefund = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.post<Refund>(`/v1/refunds/${id}/retry`, {})
    return response.data
  },
  onSuccess: () => {
    return { id: ["refunds"] }
  },
})
