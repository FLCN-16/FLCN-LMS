import { router } from "react-query-kit"

import type { CreateQuestionPayload, Question } from "@flcn-lms/types/questions"

import fetch from "@/lib/fetch"

export type {
  Question,
  QuestionOption,
  CreateQuestionPayload,
  QuestionType,
  Difficulty,
} from "@flcn-lms/types/questions"

export const questions = router("questions", {
  list: router.query({
    fetcher: async (variables?: {
      params?: Record<string, string>
    }): Promise<Question[]> => {
      const response = await fetch.get<Question[]>("/api/questions", {
        params: variables?.params,
      })
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<Question> => {
      const response = await fetch.get<Question>(
        `/api/questions/${variables.id}`
      )
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: CreateQuestionPayload): Promise<Question> => {
      const response = await fetch.post<Question>("/api/questions", variables)
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: CreateQuestionPayload
    }): Promise<Question> => {
      const response = await fetch.patch<Question>(
        `/api/questions/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  approve: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<Question> => {
      const response = await fetch.patch<Question>(
        `/api/questions/${variables.id}/approve`
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/questions/${variables.id}`)
    },
  }),
})

export const useQuestionsList = questions.list.useQuery
export const useQuestionDetail = questions.byId.useQuery
export const useCreateQuestion = questions.add.useMutation
export const useUpdateQuestion = questions.update.useMutation
export const useApproveQuestion = questions.approve.useMutation
export const useDeleteQuestion = questions.remove.useMutation
