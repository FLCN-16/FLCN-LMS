import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

import type { LiveSession } from "../courses/index.ts"

export const liveSessions = router("liveSessions", {
  list: router.query({
    fetcher: async (variables?: { courseId?: string }): Promise<LiveSession[]> => {
      const response = await fetch.get<LiveSession[]>("/api/v1/live-sessions", {
        params: variables,
      })
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<LiveSession> => {
      const response = await fetch.get<LiveSession>(
        `/api/v1/live-sessions/${variables.id}`
      )
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: any): Promise<LiveSession> => {
      const response = await fetch.post<LiveSession>(
        "/api/v1/live-sessions",
        variables
      )
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: any
    }): Promise<LiveSession> => {
      const response = await fetch.patch<LiveSession>(
        `/api/v1/live-sessions/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/v1/live-sessions/${variables.id}`)
    },
  }),
})

export const useLiveSessionsList = liveSessions.list.useQuery
export const useLiveSessionDetail = liveSessions.byId.useQuery
export const useCreateLiveSession = liveSessions.add.useMutation
export const useUpdateLiveSession = liveSessions.update.useMutation
export const useDeleteLiveSession = liveSessions.remove.useMutation
