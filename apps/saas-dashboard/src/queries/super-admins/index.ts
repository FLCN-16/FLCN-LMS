import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface SuperAdmin {
  id: string
  email: string
  name: string
  role: "super_admin"
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface CreateSuperAdminInput {
  email: string
  name: string
  password: string
}

export interface UpdateSuperAdminInput {
  email?: string
  name?: string
}

// Query: Get all super admins
export const useSuperAdmins = createQuery<SuperAdmin[]>({
  queryKey: ["super-admins"],
  fetcher: async () => {
    const response = await fetch.get<SuperAdmin[]>("/v1/super-admins")
    return response.data
  },
})

// Query: Get single super admin
export const useSuperAdmin = createQuery<SuperAdmin, { id: string }>({
  queryKey: ["super-admins", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<SuperAdmin>(`/v1/super-admins/${id}`)
    return response.data
  },
})

// Mutation: Create super admin
export const useCreateSuperAdmin = createMutation({
  mutationFn: async (data: CreateSuperAdminInput) => {
    const response = await fetch.post<SuperAdmin>("/v1/super-admins", data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["super-admins"] }
  },
})

// Mutation: Update super admin
export const useUpdateSuperAdmin = createMutation({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string
    data: UpdateSuperAdminInput
  }) => {
    const response = await fetch.patch<SuperAdmin>(
      `/v1/super-admins/${id}`,
      data
    )
    return response.data
  },
  onSuccess: () => {
    return { id: ["super-admins"] }
  },
})

// Mutation: Delete super admin
export const useDeleteSuperAdmin = createMutation({
  mutationFn: async (id: string) => {
    await fetch.delete(`/v1/super-admins/${id}`)
    return { success: true }
  },
  onSuccess: () => {
    return { id: ["super-admins"] }
  },
})
