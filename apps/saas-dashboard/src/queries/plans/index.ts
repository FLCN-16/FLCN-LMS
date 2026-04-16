import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface Plan {
  id: string
  name: string
  description?: string
  priceMonthly: number
  priceYearly: number
  features?: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreatePlanInput {
  name: string
  description?: string
  priceMonthly: number
  priceYearly: number
  features?: Record<string, any>
  isActive?: boolean
}

export interface UpdatePlanInput extends Partial<CreatePlanInput> {}

// Query: Get all plans
export const usePlans = createQuery<Plan[]>({
  queryKey: ["plans"],
  fetcher: async () => {
    const response = await fetch.get<Plan[]>("/v1/plans")
    return response.data
  },
})

// Query: Get single plan by ID
export const usePlan = createQuery<Plan, { id: string }>({
  queryKey: ["plan", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<Plan>(`/v1/plans/${id}`)
    return response.data
  },
})

// Mutation: Create plan
export const useCreatePlan = createMutation({
  mutationFn: async (input: CreatePlanInput) => {
    const response = await fetch.post<Plan>("/v1/plans", input)
    return response.data
  },
  onSuccess: () => {
    return { id: ["plans"] }
  },
})

// Mutation: Update plan
export const useUpdatePlan = createMutation({
  mutationFn: async (input: { id: string; data: UpdatePlanInput }) => {
    const response = await fetch.patch<Plan>(`/v1/plans/${input.id}`, input.data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["plans"] }
  },
})

// Mutation: Delete plan
export const useDeletePlan = createMutation({
  mutationFn: async (id: string) => {
    await fetch.delete(`/v1/plans/${id}`)
    return { success: true }
  },
  onSuccess: () => {
    return { id: ["plans"] }
  },
})
