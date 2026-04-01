import { router } from "react-query-kit"

import type { TestAttempt, TestResult } from "@flcn-lms/types/attempts"
import type { LeaderboardEntry } from "@flcn-lms/types/leaderboard"

import fetch from "@/lib/fetch"

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

export const attempts = router("attempts", {
  list: router.query({
    fetcher: async (variables?: {
      testId?: string
    }): Promise<TestAttempt[]> => {
      const response = await fetch.get<TestAttempt[]>("/api/attempts", {
        params: variables?.testId ? { testId: variables.testId } : {},
      })
      return response.data
    },
  }),

  result: router.query({
    fetcher: async (variables: { attemptId: string }): Promise<TestResult> => {
      const response = await fetch.get<TestResult>(
        `/api/attempts/${variables.attemptId}/result`
      )
      return response.data
    },
  }),

  disqualify: router.mutation({
    mutationFn: async (variables: { attemptId: string }) => {
      const response = await fetch.patch(
        `/api/attempts/${variables.attemptId}/disqualify`
      )
      return response.data
    },
  }),

  leaderboard: {
    topN: router.query({
      fetcher: async (variables: {
        testId: string
        limit?: number
      }): Promise<LeaderboardEntry[]> => {
        const response = await fetch.get<LeaderboardEntry[]>(
          `/api/leaderboard/tests/${variables.testId}`,
          {
            params: variables.limit ? { limit: variables.limit } : {},
          }
        )
        return response.data
      },
    }),

    recompute: router.mutation({
      mutationFn: async (variables: { testId: string }) => {
        const response = await fetch.post(
          `/api/leaderboard/tests/${variables.testId}/recompute`
        )
        return response.data
      },
    }),
  },
})

export const useAttempts = attempts.list.useQuery
export const useAttemptResult = attempts.result.useQuery
export const useDisqualifyAttempt = attempts.disqualify.useMutation
export const useLeaderboardTopN = attempts.leaderboard.topN.useQuery
export const useRecomputeLeaderboard =
  attempts.leaderboard.recompute.useMutation
