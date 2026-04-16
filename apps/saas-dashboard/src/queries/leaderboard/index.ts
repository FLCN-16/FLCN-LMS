import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatarUrl?: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timeTakenSecs: number
}

export const leaderboard = router("leaderboard", {
  get: router.query({
    fetcher: async (variables?: {
      testSeriesId?: string
      courseId?: string
    }): Promise<LeaderboardEntry[]> => {
      const response = await fetch.get<LeaderboardEntry[]>("/v1/leaderboard", {
        params: variables,
      })
      return response.data
    },
  }),
})

export const useLeaderboard = leaderboard.get.useQuery
