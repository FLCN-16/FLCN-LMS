import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all subscriptions
export const useSubscriptions = createQuery({
    queryKey: ["subscriptions"],
    fetcher: async () => {
        const response = await fetch.get("/v1/billing");
        return response.data;
    },
});
// Query: Get single subscription
export const useSubscription = createQuery({
    queryKey: ["subscription", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/billing/${id}`);
        return response.data;
    },
});
// Query: Get subscriptions by customer
export const useCustomerSubscriptions = createQuery({
    queryKey: ["subscriptions", "by-customer"],
    fetcher: async ({ customerId }) => {
        const response = await fetch.get(`/v1/billing/${customerId}`);
        return response.data;
    },
});
// Query: Get subscription stats
export const useSubscriptionStats = createQuery({
    queryKey: ["subscriptions", "stats"],
    fetcher: async () => {
        const response = await fetch.get("/v1/billing/stats");
        return response.data;
    },
});
// Mutation: Create subscription
export const useCreateSubscription = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.post("/v1/billing", input);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["subscriptions"] };
    },
});
// Mutation: Update subscription
export const useUpdateSubscription = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.put(`/v1/billing/${input.id}`, input.data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["subscriptions"] };
    },
});
// Mutation: Cancel subscription
export const useCancelSubscription = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.post(`/v1/billing/${id}/cancel-subscription`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["subscriptions"] };
    },
});
// Mutation: Retry payment
export const useRetryPayment = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.post(`/v1/billing/${id}/retry-payment`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["subscriptions"] };
    },
});
