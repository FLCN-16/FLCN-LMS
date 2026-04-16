import { createMutation, createQuery } from "react-query-kit";
import fetch from "@/lib/fetch";
// Query: Get all billing records
export const useBillingRecords = createQuery({
    queryKey: ["billing"],
    fetcher: async () => {
        const response = await fetch.get("/v1/billing");
        return response.data;
    },
});
// Query: Get single billing record
export const useBillingRecord = createQuery({
    queryKey: ["billing", "detail"],
    fetcher: async ({ id }) => {
        const response = await fetch.get(`/v1/billing/${id}`);
        return response.data;
    },
});
// Mutation: Create billing record
export const useCreateBilling = createMutation({
    mutationFn: async (data) => {
        const response = await fetch.post("/v1/billing", data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["billing"] };
    },
});
// Mutation: Update billing record
export const useUpdateBilling = createMutation({
    mutationFn: async ({ id, data, }) => {
        const response = await fetch.patch(`/v1/billing/${id}`, data);
        return response.data;
    },
    onSuccess: () => {
        return { id: ["billing"] };
    },
});
