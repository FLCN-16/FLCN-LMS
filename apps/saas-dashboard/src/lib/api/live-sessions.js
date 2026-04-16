import fetch from "../fetch";
export const liveSessionsApi = {
    list: () => fetch.get("/api/live-sessions").then((r) => r.data),
    get: (id) => fetch.get(`/api/live-sessions/${id}`).then((r) => r.data),
    create: (data) => fetch.post("/api/live-sessions", data).then((r) => r.data),
    update: (id, data) => fetch.patch(`/api/live-sessions/${id}`, data).then((r) => r.data),
    remove: (id) => fetch.delete(`/api/live-sessions/${id}`),
};
