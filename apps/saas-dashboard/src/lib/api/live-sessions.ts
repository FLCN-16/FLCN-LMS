import type {
  CreateLiveSessionPayload,
  UpdateLiveSessionPayload,
} from "@flcn-lms/types/courses"

import fetch from "../fetch"

export const liveSessionsApi = {
  list: () => fetch.get("/api/live-sessions").then((r) => r.data),
  get: (id: string) => fetch.get(`/api/live-sessions/${id}`).then((r) => r.data),
  create: (data: CreateLiveSessionPayload) =>
    fetch.post("/api/live-sessions", data).then((r) => r.data),
  update: (id: string, data: UpdateLiveSessionPayload) =>
    fetch.patch(`/api/live-sessions/${id}`, data).then((r) => r.data),
  remove: (id: string) => fetch.delete(`/api/live-sessions/${id}`),
}
