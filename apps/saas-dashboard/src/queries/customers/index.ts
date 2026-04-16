import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface Customer {
  id: string
  slug: string
  name: string
  email?: string
  domain?: string
  customDomain?: string
  logoUrl?: string
  planId?: string
  maxUsers?: number
  maxCourses?: number
  maxStorageGb?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCustomerInput {
  name: string
  slug: string
  email?: string
  customDomain?: string
  logoUrl?: string
  planId?: string
  maxUsers?: number
  maxCourses?: number
  maxStorageGb?: number
  isActive?: boolean
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {}

// Query: Get all customers
export const useCustomers = createQuery<Customer[]>({
  queryKey: ["customers"],
  fetcher: async () => {
    const response = await fetch.get<Customer[]>("/v1/institutes")
    return response.data
  },
})

// Query: Get single customer
export const useCustomer = createQuery<Customer, { id: string }>({
  queryKey: ["customer", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<Customer>(`/v1/institutes/${id}`)
    return response.data
  },
})

// Mutation: Create customer (institute)
export const useCreateCustomer = createMutation({
  mutationFn: async (input: CreateCustomerInput) => {
    const response = await fetch.post<Customer>("/v1/institutes", input)
    return response.data
  },
  onSuccess: () => {
    return { id: ["customers"] }
  },
})

// Mutation: Update customer
export const useUpdateCustomer = createMutation({
  mutationFn: async (input: { id: string; data: UpdateCustomerInput }) => {
    const response = await fetch.patch<Customer>(`/v1/institutes/${input.id}`, input.data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["customers"] }
  },
})

// Mutation: Delete customer
export const useDeleteCustomer = createMutation({
  mutationFn: async (id: string) => {
    await fetch.delete(`/v1/institutes/${id}`)
    return { success: true }
  },
  onSuccess: () => {
    return { id: ["customers"] }
  },
})
