import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all customers
export const useCustomers = createQuery({
    queryKey: ["customers"],
    fetcher: async () => {
        const response = await fetch.get("/v1/institutes");
        return response.data;
    },
});
// Query: Get single customer
export const useCustomer = createQuery({
    queryKey: ["customer", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/institutes/${id}`);
        return response.data;
    },
});
// Mutation: Create customer (institute)
export const useCreateCustomer = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.post("/v1/institutes", input);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["customers"] };
    },
});
// Mutation: Update customer
export const useUpdateCustomer = createMutation({
    mutationFn: async (input) => {
        const response = await fetch.patch(`/v1/institutes/${input.id}`, input.data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["customers"] };
    },
});
// Mutation: Delete customer
export const useDeleteCustomer = createMutation({
    mutationFn: async (id) => {
        await fetch.delete(`/v1/institutes/${id}`);
        return { success: true };
    },
    onSuccess: () => {
        return { id: ["customers"] };
    },
});
