import fetch from "../fetch";
export const questionsApi = {
    list: (params) => fetch.get("/api/questions", { params }).then((r) => r.data),
    get: (id) => fetch.get(`/api/questions/${id}`).then((r) => r.data),
    create: (data) => fetch.post("/api/questions", data).then((r) => r.data),
    update: (id, data) => fetch.patch(`/api/questions/${id}`, data).then((r) => r.data),
    approve: (id) => fetch.patch(`/api/questions/${id}/approve`).then((r) => r.data),
    remove: (id) => fetch.delete(`/api/questions/${id}`),
};
