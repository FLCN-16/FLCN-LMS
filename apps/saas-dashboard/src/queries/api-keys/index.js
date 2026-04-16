import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all API keys
export const useApiKeys = createQuery({
    queryKey: ["api-keys"],
    fetcher: async () => {
        const response = await fetch.get("/v1/api-keys");
        return response.data;
    },
});
// Query: Get single API key
export const useApiKey = createQuery({
    queryKey: ["api-keys", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/api-keys/${id}`);
        return response.data;
    },
});
// Query: Get API key stats
export const useApiKeyStats = createQuery({
    queryKey: ["api-keys", "stats"],
    fetcher: async () => {
        const response = await fetch.get("/v1/api-keys/stats");
        return response.data;
    },
});
// Mutation: Create API key
export const useCreateApiKey = createMutation({
    mutationFn: async (data) => {
        const response = await fetch.post("/v1/api-keys", data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["api-keys"] };
    },
});
// Mutation: Update API key
export const useUpdateApiKey = createMutation({
    mutationFn: async ({ id, data, }) => {
        const response = await fetch.patch(`/v1/api-keys/${id}`, data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["api-keys"] };
    },
});
// Mutation: Enable API key
export const useEnableApiKey = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.patch(`/v1/api-keys/${id}/enable`);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["api-keys"] };
    },
});
// Mutation: Disable API key
export const useDisableApiKey = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.patch(`/v1/api-keys/${id}/disable`);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["api-keys"] };
    },
});
// Mutation: Delete API key
export const useDeleteApiKey = createMutation({
    mutationFn: async (id) => {
        await fetch.delete(`/v1/api-keys/${id}`);
        return { success: true };
    },
    onSuccess: () => {
        return { id: ["api-keys"] };
    },
});
