import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all licenses with pagination and filters
export const useLicenses = createQuery({
    queryKey: ["licenses"],
    fetcher: async (variables) => {
        const response = await fetch.get("/v1/licenses", {
            params: variables || {},
        });
        return response.data;
    },
});
// Query: Get single license by ID
export const useLicense = createQuery({
    queryKey: ["license", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/licenses/${id}`);
        return response.data;
    },
});
// Query: Get license by key
export const useLicenseByKey = createQuery({
    queryKey: ["license", "by-key"],
    fetcher: async ({ key }) => {
        const response = await fetch.get(`/v1/licenses/key/${key}`);
        return response.data;
    },
});
// Query: Get license stats
export const useLicenseStats = createQuery({
    queryKey: ["license", "stats"],
    fetcher: async () => {
        const response = await fetch.get("/v1/licenses/stats/summary");
        return response.data;
    },
});
// Query: Get features for a license
export const useLicenseFeatures = createQuery({
    queryKey: ["license", "features"],
    fetcher: async ({ key }) => {
        const response = await fetch.get(`/v1/licenses/${key}/features`);
        return response.data;
    },
});
// Mutation: Issue new license
export const useIssueLicense = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.post("/v1/licenses/issue", input);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["licenses"] };
    },
});
// Mutation: Update license
export const useUpdateLicense = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.put(`/v1/licenses/${input.id}`, input.data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["licenses"] };
    },
});
// Mutation: Suspend license
export const useSuspendLicense = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.patch(`/v1/licenses/${id}/suspend`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["licenses"] };
    },
});
// Mutation: Reactivate license
export const useReactivateLicense = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.patch(`/v1/licenses/${id}/reactivate`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["licenses"] };
    },
});
// Mutation: Revoke license
export const useRevokeLicense = createMutation({
    mutationFn: async (id) => {
        await fetch.delete(`/v1/licenses/${id}`);
        return { success: true };
    },
    onSuccess: () => {
        return { id: ["licenses"] };
    },
});
