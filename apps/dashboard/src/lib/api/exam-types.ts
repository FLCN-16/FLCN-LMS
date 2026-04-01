import type {
  CreateExamTypePayload,
  ExamType,
  UpdateExamTypePayload,
} from "@flcn-lms/types/exam-type"

import fetch from "../fetch"

export type {
  ExamType,
  CreateExamTypePayload,
  UpdateExamTypePayload,
} from "@flcn-lms/types/exam-type"

export const examTypesApi = {
  list: (includeInactive = false) =>
    fetch
      .get<
        ExamType[]
      >("/api/exam-types", { params: includeInactive ? { includeInactive: "true" } : {} })
      .then((r) => r.data),

  create: (data: CreateExamTypePayload) =>
    fetch.post<ExamType>("/api/exam-types", data).then((r) => r.data),

  update: (id: string, data: UpdateExamTypePayload) =>
    fetch.patch<ExamType>(`/api/exam-types/${id}`, data).then((r) => r.data),

  remove: (id: string) => fetch.delete(`/api/exam-types/${id}`),

  seed: () => fetch.post("/api/exam-types/seed").then((r) => r.data),
}
