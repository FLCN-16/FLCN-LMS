import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const questions = router("questions", {
    list: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get("/api/questions", {
                params: variables?.params,
            });
            return response.data;
        },
    }),
    byId: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/questions/${variables.id}`);
            return response.data;
        },
    }),
    add: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post("/api/questions", variables);
            return response.data;
        },
    }),
    update: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/questions/${variables.id}`, variables.data);
            return response.data;
        },
    }),
    approve: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/questions/${variables.id}/approve`);
            return response.data;
        },
    }),
    remove: router.mutation({
        mutationFn: async (variables) => {
            await fetch.delete(`/api/questions/${variables.id}`);
        },
    }),
});
export const useQuestionsList = questions.list.useQuery;
export const useQuestionDetail = questions.byId.useQuery;
export const useCreateQuestion = questions.add.useMutation;
export const useUpdateQuestion = questions.update.useMutation;
export const useApproveQuestion = questions.approve.useMutation;
export const useDeleteQuestion = questions.remove.useMutation;
