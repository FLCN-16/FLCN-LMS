import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const attempts = router("attempts", {
    list: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get("/api/attempts", {
                params: variables?.testId ? { testId: variables.testId } : {},
            });
            return response.data;
        },
    }),
    result: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/attempts/${variables.attemptId}/result`);
            return response.data;
        },
    }),
    disqualify: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/attempts/${variables.attemptId}/disqualify`);
            return response.data;
        },
    }),
    leaderboard: {
        topN: router.query({
            fetcher: async (variables) => {
                const response = await fetch.get(`/api/leaderboard/tests/${variables.testId}`, {
                    params: variables.limit ? { limit: variables.limit } : {},
                });
                return response.data;
            },
        }),
        recompute: router.mutation({
            mutationFn: async (variables) => {
                const response = await fetch.post(`/api/leaderboard/tests/${variables.testId}/recompute`);
                return response.data;
            },
        }),
    },
});
export const useAttempts = attempts.list.useQuery;
export const useAttemptResult = attempts.result.useQuery;
export const useDisqualifyAttempt = attempts.disqualify.useMutation;
export const useLeaderboardTopN = attempts.leaderboard.topN.useQuery;
export const useRecomputeLeaderboard = attempts.leaderboard.recompute.useMutation;
