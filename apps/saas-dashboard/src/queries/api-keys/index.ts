import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface ApiKey {
  id: string
  name: string
  prefix: string
  enabled: boolean
  scopes: string[]
  lastUsedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ApiKeyWithSecret extends ApiKey {
  secret?: string // Only returned on creation
}

export interface CreateApiKeyInput {
  name: string
  scopes: string[]
}

export interface UpdateApiKeyInput {
  name?: string
  scopes?: string[]
}

export interface ApiKeyStats {
  total: number
  enabled: number
  disabled: number
}

// Query: Get all API keys
export const useApiKeys = createQuery<ApiKey[]>({
  queryKey: ["api-keys"],
  fetcher: async () => {
    const response = await fetch.get<ApiKey[]>("/v1/api-keys")
    return response.data
  },
})

// Query: Get single API key
export const useApiKey = createQuery<ApiKey, { id: string }>({
  queryKey: ["api-keys", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<ApiKey>(`/v1/api-keys/${id}`)
    return response.data
  },
})

// Query: Get API key stats
export const useApiKeyStats = createQuery<ApiKeyStats>({
  queryKey: ["api-keys", "stats"],
  fetcher: async () => {
    const response = await fetch.get<ApiKeyStats>("/v1/api-keys/stats")
    return response.data
  },
})

// Mutation: Create API key
export const useCreateApiKey = createMutation({
  mutationFn: async (data: CreateApiKeyInput) => {
    const response = await fetch.post<ApiKeyWithSecret>("/v1/api-keys", data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["api-keys"] }
  },
})

// Mutation: Update API key
export const useUpdateApiKey = createMutation({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string
    data: UpdateApiKeyInput
  }) => {
    const response = await fetch.patch<ApiKey>(`/v1/api-keys/${id}`, data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["api-keys"] }
  },
})

// Mutation: Enable API key
export const useEnableApiKey = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.patch<ApiKey>(`/v1/api-keys/${id}/enable`)
    return response.data
  },
  onSuccess: () => {
    return { id: ["api-keys"] }
  },
})

// Mutation: Disable API key
export const useDisableApiKey = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.patch<ApiKey>(`/v1/api-keys/${id}/disable`)
    return response.data
  },
  onSuccess: () => {
    return { id: ["api-keys"] }
  },
})

// Mutation: Delete API key
export const useDeleteApiKey = createMutation({
  mutationFn: async (id: string) => {
    await fetch.delete(`/v1/api-keys/${id}`)
    return { success: true }
  },
  onSuccess: () => {
    return { id: ["api-keys"] }
  },
})
