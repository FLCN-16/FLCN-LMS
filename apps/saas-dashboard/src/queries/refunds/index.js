import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all refunds
export const useRefunds = createQuery({
    queryKey: ["refunds"],
    fetcher: async () => {
        const response = await fetch.get("/v1/refunds");
        return response.data;
    },
});
// Query: Get single refund
export const useRefund = createQuery({
    queryKey: ["refunds", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/refunds/${id}`);
        return response.data;
    },
});
// Query: Get refund stats
export const useRefundStats = createQuery({
    queryKey: ["refunds", "stats"],
    fetcher: async () => {
        const response = await fetch.get("/v1/refunds/stats");
        return response.data;
    },
});
// Mutation: Create refund
export const useCreateRefund = createMutation({
    mutationFn: async (data) => {
        const response = await fetch.post("/v1/refunds", data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["refunds"] };
    },
});
// Mutation: Approve refund
export const useApproveRefund = createMutation({
    mutationFn: async ({ id, notes }) => {
        const response = await fetch.post(`/v1/refunds/${id}/approve`, {
            notes,
        });
        return response.data;
    },
    onSuccess: () => {
        return { id: ["refunds"] };
    },
});
// Mutation: Reject refund
export const useRejectRefund = createMutation({
    mutationFn: async ({ id, notes }) => {
        const response = await fetch.post(`/v1/refunds/${id}/reject`, {
            notes,
        });
        return response.data;
    },
    onSuccess: () => {
        return { id: ["refunds"] };
    },
});
// Mutation: Process refund
export const useProcessRefund = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.post(`/v1/refunds/${id}/process`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["refunds"] };
    },
});
// Mutation: Retry refund
export const useRetryRefund = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.post(`/v1/refunds/${id}/retry`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["refunds"] };
    },
});
