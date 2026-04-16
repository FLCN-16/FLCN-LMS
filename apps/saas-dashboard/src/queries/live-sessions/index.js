import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const liveSessions = router("liveSessions", {
    list: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get("/v1/live-sessions", {
                params: variables,
            });
            return response.data;
        },
    }),
    byId: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/v1/live-sessions/${variables.id}`);
            return response.data;
        },
    }),
    add: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post("/v1/live-sessions", variables);
            return response.data;
        },
    }),
    update: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/v1/live-sessions/${variables.id}`, variables.data);
            return response.data;
        },
    }),
    remove: router.mutation({
        mutationFn: async (variables) => {
            await fetch.delete(`/v1/live-sessions/${variables.id}`);
        },
    }),
});
export const useLiveSessionsList = liveSessions.list.useQuery;
export const useLiveSessionDetail = liveSessions.byId.useQuery;
export const useCreateLiveSession = liveSessions.add.useMutation;
export const useUpdateLiveSession = liveSessions.update.useMutation;
export const useDeleteLiveSession = liveSessions.remove.useMutation;
