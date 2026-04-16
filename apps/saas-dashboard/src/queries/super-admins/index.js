import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all super admins
export const useSuperAdmins = createQuery({
    queryKey: ["super-admins"],
    fetcher: async () => {
        const response = await fetch.get("/v1/super-admins");
        return response.data;
    },
});
// Query: Get single super admin
export const useSuperAdmin = createQuery({
    queryKey: ["super-admins", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/super-admins/${id}`);
        return response.data;
    },
});
// Mutation: Create super admin
export const useCreateSuperAdmin = createMutation({
    mutationFn: async (data) => {
        const response = await fetch.post("/v1/super-admins", data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["super-admins"] };
    },
});
// Mutation: Update super admin
export const useUpdateSuperAdmin = createMutation({
    mutationFn: async ({ id, data, }) => {
        const response = await fetch.patch(`/v1/super-admins/${id}`, data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["super-admins"] };
    },
});
// Mutation: Delete super admin
export const useDeleteSuperAdmin = createMutation({
    mutationFn: async (id) => {
        await fetch.delete(`/v1/super-admins/${id}`);
        return { success: true };
    },
    onSuccess: () => {
        return { id: ["super-admins"] };
    },
});
