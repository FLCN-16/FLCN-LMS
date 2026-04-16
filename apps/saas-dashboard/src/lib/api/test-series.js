import fetch from "../fetch";
export const testSeriesApi = {
    list: () => fetch.get("/api/test-series").then((r) => r.data),
    get: (id) => fetch.get(`/api/test-series/${id}`).then((r) => r.data),
    create: (data) => fetch.post("/api/test-series", data).then((r) => r.data),
    update: (id, data) => fetch.patch(`/api/test-series/${id}`, data).then((r) => r.data),
    publish: (id) => fetch
        .patch(`/api/test-series/${id}/publish`)
        .then((r) => r.data),
    remove: (id) => fetch.delete(`/api/test-series/${id}`),
    listTests: (seriesId) => fetch.get(`/api/test-series/${seriesId}/tests`).then((r) => r.data),
    getTest: (seriesId, testId) => fetch
        .get(`/api/test-series/${seriesId}/tests/${testId}`)
        .then((r) => r.data),
    createTest: (seriesId, data) => fetch
        .post(`/api/test-series/${seriesId}/tests`, data)
        .then((r) => r.data),
    updateTest: (seriesId, testId, data) => fetch
        .patch(`/api/test-series/${seriesId}/tests/${testId}`, data)
        .then((r) => r.data),
    publishTest: (seriesId, testId) => fetch
        .patch(`/api/test-series/${seriesId}/tests/${testId}/publish`)
        .then((r) => r.data),
};
