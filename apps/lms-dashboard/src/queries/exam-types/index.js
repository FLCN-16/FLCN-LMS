import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const examTypes = router("examTypes", {
    list: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get("/api/exam-types", {
                params: variables?.includeInactive ? { includeInactive: "true" } : {},
            });
            return response.data;
        },
    }),
    byId: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/exam-types/${variables.id}`);
            return response.data;
        },
    }),
    add: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post("/api/exam-types", variables);
            return response.data;
        },
    }),
    update: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/exam-types/${variables.id}`, variables.data);
            return response.data;
        },
    }),
    remove: router.mutation({
        mutationFn: async (variables) => {
            await fetch.delete(`/api/exam-types/${variables.id}`);
        },
    }),
    seed: router.mutation({
        mutationFn: async () => {
            const response = await fetch.post("/api/exam-types/seed");
            return response.data;
        },
    }),
});
export const useExamTypesList = examTypes.list.useQuery;
export const useExamTypeDetail = examTypes.byId.useQuery;
export const useCreateExamType = examTypes.add.useMutation;
export const useUpdateExamType = examTypes.update.useMutation;
export const useDeleteExamType = examTypes.remove.useMutation;
export const useSeedExamTypes = examTypes.seed.useMutation;
