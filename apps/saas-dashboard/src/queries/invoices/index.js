import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all invoices
export const useInvoices = createQuery({
    queryKey: ["invoices"],
    fetcher: async () => {
        const response = await fetch.get("/v1/invoices");
        return response.data;
    },
});
// Query: Get single invoice
export const useInvoice = createQuery({
    queryKey: ["invoices", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/invoices/${id}`);
        return response.data;
    },
});
// Query: Get invoice stats
export const useInvoiceStats = createQuery({
    queryKey: ["invoices", "stats"],
    fetcher: async () => {
        const response = await fetch.get("/v1/invoices/stats");
        return response.data;
    },
});
// Mutation: Create invoice
export const useCreateInvoice = createMutation({
    mutationFn: async (data) => {
        const response = await fetch.post("/v1/invoices", data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["invoices"] };
    },
});
// Mutation: Update invoice
export const useUpdateInvoice = createMutation({
    mutationFn: async ({ id, data, }) => {
        const response = await fetch.patch(`/v1/invoices/${id}`, data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["invoices"] };
    },
});
// Mutation: Mark invoice as paid
export const useMarkInvoicePaid = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.post(`/v1/invoices/${id}/mark-paid`, {});
        return response.data;
    },
    onSuccess: () => {
        return { id: ["invoices"] };
    },
});
// Mutation: Cancel invoice
export const useCancelInvoice = createMutation({
    mutationFn: async (id) => {
        const response = await fetch.delete(`/v1/invoices/${id}/cancel`);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["invoices"] };
    },
});
