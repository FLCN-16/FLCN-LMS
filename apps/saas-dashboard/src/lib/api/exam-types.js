import fetch from "../fetch";
export const examTypesApi = {
    list: (includeInactive = false) => fetch
        .get("/api/exam-types", { params: includeInactive ? { includeInactive: "true" } : {} })
        .then((r) => r.data),
    create: (data) => fetch.post("/api/exam-types", data).then((r) => r.data),
    update: (id, data) => fetch.patch(`/api/exam-types/${id}`, data).then((r) => r.data),
    remove: (id) => fetch.delete(`/api/exam-types/${id}`),
    seed: () => fetch.post("/api/exam-types/seed").then((r) => r.data),
};
