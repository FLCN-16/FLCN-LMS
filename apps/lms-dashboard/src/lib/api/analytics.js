import fetch from "../fetch";
export const analyticsApi = {
    getOverview: () => fetch.get("/api/analytics/overview").then((r) => r.data),
    getCourseStats: (id) => fetch.get(`/api/analytics/courses/${id}`).then((r) => r.data),
    getTestStats: (id) => fetch.get(`/api/analytics/tests/${id}`).then((r) => r.data),
};
