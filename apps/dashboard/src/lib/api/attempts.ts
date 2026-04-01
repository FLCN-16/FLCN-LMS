import type { TestAttempt, TestResult } from "@flcn-lms/types/attempts"
import type { LeaderboardEntry } from "@flcn-lms/types/leaderboard"

import fetch from "../fetch"

export type {
  TestAttempt,
  AttemptSection,
  QuestionResponse,
  TestResult,
  StartAttemptPayload,
  SaveResponsePayload,
  AttemptStatus,
  ResponseStatus,
  SectionBreakdownEntry,
  TopicBreakdownEntry,
} from "@flcn-lms/types/attempts"
export type { LeaderboardEntry } from "@flcn-lms/types/leaderboard"

export const attemptsApi = {
  list: (testId?: string) =>
    fetch
      .get<TestAttempt[]>("/api/attempts", { params: testId ? { testId } : {} })
      .then((r) => r.data),

  getResult: (attemptId: string) =>
    fetch
      .get<TestResult>(`/api/attempts/${attemptId}/result`)
      .then((r) => r.data),

  disqualify: (attemptId: string) =>
    fetch.patch(`/api/attempts/${attemptId}/disqualify`).then((r) => r.data),
}

export const leaderboardApi = {
  getTopN: (testId: string, limit?: number) =>
    fetch
      .get<LeaderboardEntry[]>(`/api/leaderboard/tests/${testId}`, {
        params: limit ? { limit } : {},
      })
      .then((r) => r.data),

  recompute: (testId: string) =>
    fetch
      .post(`/api/leaderboard/tests/${testId}/recompute`)
      .then((r) => r.data),
}
