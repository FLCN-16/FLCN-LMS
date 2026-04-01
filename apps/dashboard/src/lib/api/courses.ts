import type {
  CreateCategoryPayload,
  CreateCoursePayload,
  UpdateCategoryPayload,
  UpdateCoursePayload,
} from "@flcn-lms/types/courses"

import fetch from "../fetch"

export const coursesApi = {
  list: () => fetch.get("/api/courses").then((r) => r.data),
  get: (id: string) => fetch.get(`/api/courses/${id}`).then((r) => r.data),
  create: (data: CreateCoursePayload) =>
    fetch.post("/api/courses", data).then((r) => r.data),
  update: (id: string, data: UpdateCoursePayload) =>
    fetch.patch(`/api/courses/${id}`, data).then((r) => r.data),
  remove: (id: string) => fetch.delete(`/api/courses/${id}`),

  categories: {
    list: () => fetch.get("/api/course-categories").then((r) => r.data),
    get: (id: string) =>
      fetch.get(`/api/course-categories/${id}`).then((r) => r.data),
    create: (data: CreateCategoryPayload) =>
      fetch.post("/api/course-categories", data).then((r) => r.data),
    update: (id: string, data: UpdateCategoryPayload) =>
      fetch.patch(`/api/course-categories/${id}`, data).then((r) => r.data),
    remove: (id: string) => fetch.delete(`/api/course-categories/${id}`),
  },
}
