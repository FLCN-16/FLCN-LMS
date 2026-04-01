import fetch from "../fetch"

export const leaderboardApi = {
  get: (params?: { testSeriesId?: string; courseId?: string }) =>
    fetch.get("/api/leaderboard", { params }).then((r) => r.data),
}
