import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface Feature {
  name: string
  enabled: boolean
  limit?: number
}

export interface License {
  id: string
  licenseKey: string
  organizationName: string
  status: "active" | "expired" | "invalid" | "suspended" | "pending"
  isValid: boolean
  expiryDate?: Date
  features: Feature[]
  maxUsers: number
  lastVerifiedAt?: Date
  verificationCount: number
  createdAt: Date
  updatedAt: Date
}

export interface LicenseListResponse {
  data: License[]
  total: number
  skip: number
  take: number
}

export interface IssueLicenseInput {
  organizationName: string
  licenseKey: string
  planId?: string
  instituteId?: string
  expiryDate?: string
  features?: Feature[]
  maxUsers?: number
  notes?: string
}

export interface UpdateLicenseInput {
  organizationName?: string
  status?: "active" | "expired" | "invalid" | "suspended" | "pending"
  expiryDate?: string
  features?: Feature[]
  maxUsers?: number
  notes?: string
}

export interface LicenseStats {
  total: number
  active: number
  expired: number
  suspended: number
  invalid: number
}

// Query: Get all licenses with pagination and filters
export const useLicenses = createQuery<LicenseListResponse, { skip?: number; take?: number; search?: string; status?: string } | void>({
  queryKey: ["licenses"],
  fetcher: async (variables) => {
    const response = await fetch.get<LicenseListResponse>("/v1/licenses", {
      params: variables || {},
    })
    return response.data
  },
})

// Query: Get single license by ID
export const useLicense = createQuery<License, { id: string }>({
  queryKey: ["license", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<License>(`/v1/licenses/${id}`)
    return response.data
  },
})

// Query: Get license by key
export const useLicenseByKey = createQuery<License, { key: string }>({
  queryKey: ["license", "by-key"],
  fetcher: async ({ key }) => {
    const response = await fetch.get<License>(`/v1/licenses/key/${key}`)
    return response.data
  },
})

// Query: Get license stats
export const useLicenseStats = createQuery<LicenseStats>({
  queryKey: ["license", "stats"],
  fetcher: async () => {
    const response = await fetch.get<LicenseStats>("/v1/licenses/stats/summary")
    return response.data
  },
})

// Query: Get features for a license
export const useLicenseFeatures = createQuery<Feature[], { key: string }>({
  queryKey: ["license", "features"],
  fetcher: async ({ key }) => {
    const response = await fetch.get<Feature[]>(`/v1/licenses/${key}/features`)
    return response.data
  },
})

// Mutation: Issue new license
export const useIssueLicense = createMutation({
  mutationFn: async (input: IssueLicenseInput) => {
    const response = await fetch.post<License>("/v1/licenses/issue", input)
    return response.data
  },
  onSuccess: () => {
    return { id: ["licenses"] }
  },
})

// Mutation: Update license
export const useUpdateLicense = createMutation({
  mutationFn: async (input: { id: string; data: UpdateLicenseInput }) => {
    const response = await fetch.put<License>(`/v1/licenses/${input.id}`, input.data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["licenses"] }
  },
})

// Mutation: Suspend license
export const useSuspendLicense = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.patch<License>(`/v1/licenses/${id}/suspend`, {})
    return response.data
  },
  onSuccess: () => {
    return { id: ["licenses"] }
  },
})

// Mutation: Reactivate license
export const useReactivateLicense = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.patch<License>(`/v1/licenses/${id}/reactivate`, {})
    return response.data
  },
  onSuccess: () => {
    return { id: ["licenses"] }
  },
})

// Mutation: Revoke license
export const useRevokeLicense = createMutation({
  mutationFn: async (id: string) => {
    await fetch.delete(`/v1/licenses/${id}`)
    return { success: true }
  },
  onSuccess: () => {
    return { id: ["licenses"] }
  },
})
