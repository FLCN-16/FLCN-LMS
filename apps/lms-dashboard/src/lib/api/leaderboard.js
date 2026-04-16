import fetch from "../fetch";
export const leaderboardApi = {
    get: (params) => fetch.get("/api/leaderboard", { params }).then((r) => r.data),
};
