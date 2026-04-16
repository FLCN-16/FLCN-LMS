import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface Subscription {
  id: string
  licenseId: string
  customerId: string
  planId: string
  status: "active" | "paused" | "cancelled" | "expired"
  billingCycle: "monthly" | "yearly"
  nextBillingDate?: Date
  amount: number
  currency: string
  stripeSubscriptionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateSubscriptionInput {
  licenseId: string
  planId: string
  billingCycle: "monthly" | "yearly"
}

export interface UpdateSubscriptionInput {
  status?: "active" | "paused" | "cancelled"
}

export interface SubscriptionStats {
  total: number
  active: number
  paused: number
  cancelled: number
  expired: number
}

// Query: Get all subscriptions
export const useSubscriptions = createQuery<Subscription[]>({
  queryKey: ["subscriptions"],
  fetcher: async () => {
    const response = await fetch.get<Subscription[]>("/v1/billing")
    return response.data
  },
})

// Query: Get single subscription
export const useSubscription = createQuery<Subscription, { id: string }>({
  queryKey: ["subscription", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<Subscription>(`/v1/billing/${id}`)
    return response.data
  },
})

// Query: Get subscriptions by customer
export const useCustomerSubscriptions = createQuery<Subscription[], { customerId: string }>({
  queryKey: ["subscriptions", "by-customer"],
  fetcher: async ({ customerId }) => {
    const response = await fetch.get<Subscription[]>(`/v1/billing/${customerId}`)
    return response.data
  },
})

// Query: Get subscription stats
export const useSubscriptionStats = createQuery<SubscriptionStats>({
  queryKey: ["subscriptions", "stats"],
  fetcher: async () => {
    const response = await fetch.get<SubscriptionStats>("/v1/billing/stats")
    return response.data
  },
})

// Mutation: Create subscription
export const useCreateSubscription = createMutation({
  mutationFn: async (input: CreateSubscriptionInput) => {
    const response = await fetch.post<Subscription>("/v1/billing", input)
    return response.data
  },
  onSuccess: () => {
    return { id: ["subscriptions"] }
  },
})

// Mutation: Update subscription
export const useUpdateSubscription = createMutation({
  mutationFn: async (input: { id: string; data: UpdateSubscriptionInput }) => {
    const response = await fetch.put<Subscription>(`/v1/billing/${input.id}`, input.data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["subscriptions"] }
  },
})

// Mutation: Cancel subscription
export const useCancelSubscription = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.post<Subscription>(`/v1/billing/${id}/cancel-subscription`, {})
    return response.data
  },
  onSuccess: () => {
    return { id: ["subscriptions"] }
  },
})

// Mutation: Retry payment
export const useRetryPayment = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.post<Subscription>(`/v1/billing/${id}/retry-payment`, {})
    return response.data
  },
  onSuccess: () => {
    return { id: ["subscriptions"] }
  },
})
