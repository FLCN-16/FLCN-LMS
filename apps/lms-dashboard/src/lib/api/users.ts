import fetch from "../fetch"

export const usersApi = {
  list: () => fetch.get("/api/users").then((r) => r.data),
  get: (id: string) => fetch.get(`/api/users/${id}`).then((r) => r.data),
  create: (data: any) => fetch.post("/api/users", data).then((r) => r.data),
  update: (id: string, data: any) =>
    fetch.patch(`/api/users/${id}`, data).then((r) => r.data),
  remove: (id: string) => fetch.delete(`/api/users/${id}`),
}
