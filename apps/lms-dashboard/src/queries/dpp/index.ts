import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

export interface DailyPracticePaper {
  id: string
  tenantId: string
  courseId?: string | null
  title: string
  description?: string | null
  totalQuestions: number
  duration: number
  difficulty: "easy" | "medium" | "hard"
  publishedAt?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export const dpp = router("dpp", {
  list: router.query({
    fetcher: async (variables?: { courseId?: string }): Promise<DailyPracticePaper[]> => {
      const response = await fetch.get<DailyPracticePaper[]>("/api/v1/dpp", {
        params: variables,
      })
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<DailyPracticePaper> => {
      const response = await fetch.get<DailyPracticePaper>(
        `/api/v1/dpp/${variables.id}`
      )
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: any): Promise<DailyPracticePaper> => {
      const response = await fetch.post<DailyPracticePaper>(
        "/api/v1/dpp",
        variables
      )
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: any
    }): Promise<DailyPracticePaper> => {
      const response = await fetch.patch<DailyPracticePaper>(
        `/api/v1/dpp/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/v1/dpp/${variables.id}`)
    },
  }),
})

export const useDppList = dpp.list.useQuery
export const useDppDetail = dpp.byId.useQuery
export const useCreateDpp = dpp.add.useMutation
export const useUpdateDpp = dpp.update.useMutation
export const useDeleteDpp = dpp.remove.useMutation
