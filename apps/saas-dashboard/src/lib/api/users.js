import fetch from "../fetch";
export const usersApi = {
    list: () => fetch.get("/api/users").then((r) => r.data),
    get: (id) => fetch.get(`/api/users/${id}`).then((r) => r.data),
    create: (data) => fetch.post("/api/users", data).then((r) => r.data),
    update: (id, data) => fetch.patch(`/api/users/${id}`, data).then((r) => r.data),
    remove: (id) => fetch.delete(`/api/users/${id}`),
};
