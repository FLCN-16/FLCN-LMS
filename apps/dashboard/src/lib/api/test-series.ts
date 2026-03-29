import type { TestSeries, Test, CreateTestSeriesPayload, CreateTestPayload } from '@flcn-lms/types/test-series'
import fetch from '../fetch'

export type { TestSeries, Test, TestSection, TestSeriesEnrollment, CreateTestSeriesPayload, CreateTestPayload, CreateTestSectionPayload, TestType, ResultMode } from '@flcn-lms/types/test-series'

export const testSeriesApi = {
  list: () =>
    fetch.get<TestSeries[]>('/api/test-series').then((r) => r.data),

  get: (id: string) =>
    fetch.get<TestSeries>(`/api/test-series/${id}`).then((r) => r.data),

  create: (data: CreateTestSeriesPayload) =>
    fetch.post<TestSeries>('/api/test-series', data).then((r) => r.data),

  update: (id: string, data: CreateTestSeriesPayload) =>
    fetch.patch<TestSeries>(`/api/test-series/${id}`, data).then((r) => r.data),

  publish: (id: string) =>
    fetch.patch<TestSeries>(`/api/test-series/${id}/publish`).then((r) => r.data),

  remove: (id: string) =>
    fetch.delete(`/api/test-series/${id}`),

  listTests: (seriesId: string) =>
    fetch.get<Test[]>(`/api/test-series/${seriesId}/tests`).then((r) => r.data),

  getTest: (seriesId: string, testId: string) =>
    fetch.get<Test>(`/api/test-series/${seriesId}/tests/${testId}`).then((r) => r.data),

  createTest: (seriesId: string, data: CreateTestPayload) =>
    fetch.post<Test>(`/api/test-series/${seriesId}/tests`, data).then((r) => r.data),

  updateTest: (seriesId: string, testId: string, data: CreateTestPayload) =>
    fetch.patch<Test>(`/api/test-series/${seriesId}/tests/${testId}`, data).then((r) => r.data),

  publishTest: (seriesId: string, testId: string) =>
    fetch.patch<Test>(`/api/test-series/${seriesId}/tests/${testId}/publish`).then((r) => r.data),
}
