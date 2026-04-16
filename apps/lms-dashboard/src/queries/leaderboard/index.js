import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const leaderboard = router("leaderboard", {
    get: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get("/api/v1/leaderboard", {
                params: variables,
            });
            return response.data;
        },
    }),
});
export const useLeaderboard = leaderboard.get.useQuery;
