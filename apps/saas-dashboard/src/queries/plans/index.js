import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all plans
export const usePlans = createQuery({
    queryKey: ["plans"],
    fetcher: async () => {
        const response = await fetch.get("/v1/plans");
        return response.data;
    },
});
// Query: Get single plan by ID
export const usePlan = createQuery({
    queryKey: ["plan", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/plans/${id}`);
        return response.data;
    },
});
// Mutation: Create plan
export const useCreatePlan = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.post("/v1/plans", input);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["plans"] };
    },
});
// Mutation: Update plan
export const useUpdatePlan = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.patch(`/v1/plans/${input.id}`, input.data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["plans"] };
    },
});
// Mutation: Delete plan
export const useDeletePlan = createMutation({
    mutationFn: async (id) => {
        await fetch.delete(`/v1/plans/${id}`);
        return { success: true };
    },
    onSuccess: () => {
        return { id: ["plans"] };
    },
});
