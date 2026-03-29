import type { Question, CreateQuestionPayload } from '@flcn-lms/types/questions'
import fetch from '../fetch'

export type { Question, QuestionOption, CreateQuestionPayload, QuestionType, Difficulty } from '@flcn-lms/types/questions'

export const questionsApi = {
  list: (params?: Record<string, string>) =>
    fetch.get<Question[]>('/api/questions', { params }).then((r) => r.data),

  get: (id: string) =>
    fetch.get<Question>(`/api/questions/${id}`).then((r) => r.data),

  create: (data: CreateQuestionPayload) =>
    fetch.post<Question>('/api/questions', data).then((r) => r.data),

  update: (id: string, data: CreateQuestionPayload) =>
    fetch.patch<Question>(`/api/questions/${id}`, data).then((r) => r.data),

  approve: (id: string) =>
    fetch.patch<Question>(`/api/questions/${id}/approve`).then((r) => r.data),

  remove: (id: string) =>
    fetch.delete(`/api/questions/${id}`),
}
