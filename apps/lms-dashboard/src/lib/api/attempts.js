import fetch from "../fetch";
export const attemptsApi = {
    list: (testId) => fetch
        .get("/api/attempts", { params: testId ? { testId } : {} })
        .then((r) => r.data),
    getResult: (attemptId) => fetch
        .get(`/api/attempts/${attemptId}/result`)
        .then((r) => r.data),
    disqualify: (attemptId) => fetch.patch(`/api/attempts/${attemptId}/disqualify`).then((r) => r.data),
};
export const leaderboardApi = {
    getTopN: (testId, limit) => fetch
        .get(`/api/leaderboard/tests/${testId}`, {
        params: limit ? { limit } : {},
    })
        .then((r) => r.data),
    recompute: (testId) => fetch
        .post(`/api/leaderboard/tests/${testId}/recompute`)
        .then((r) => r.data),
};
