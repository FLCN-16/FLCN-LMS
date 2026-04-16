import { router } from "react-query-kit"

import type {
  CreateExamTypePayload,
  ExamType,
  UpdateExamTypePayload,
} from "@flcn-lms/types/exam-type"

import fetch from "@/lib/fetch"

export type {
  ExamType,
  CreateExamTypePayload,
  UpdateExamTypePayload,
} from "@flcn-lms/types/exam-type"

export const examTypes = router("examTypes", {
  list: router.query({
    fetcher: async (variables?: {
      includeInactive?: boolean
    }): Promise<ExamType[]> => {
      const response = await fetch.get<ExamType[]>("/api/exam-types", {
        params: variables?.includeInactive ? { includeInactive: "true" } : {},
      })
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<ExamType> => {
      const response = await fetch.get<ExamType>(
        `/api/exam-types/${variables.id}`
      )
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: CreateExamTypePayload): Promise<ExamType> => {
      const response = await fetch.post<ExamType>("/api/exam-types", variables)
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: UpdateExamTypePayload
    }): Promise<ExamType> => {
      const response = await fetch.patch<ExamType>(
        `/api/exam-types/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/exam-types/${variables.id}`)
    },
  }),

  seed: router.mutation({
    mutationFn: async (): Promise<ExamType[]> => {
      const response = await fetch.post<ExamType[]>("/api/exam-types/seed")
      return response.data
    },
  }),
})

export const useExamTypesList = examTypes.list.useQuery
export const useExamTypeDetail = examTypes.byId.useQuery
export const useCreateExamType = examTypes.add.useMutation
export const useUpdateExamType = examTypes.update.useMutation
export const useDeleteExamType = examTypes.remove.useMutation
export const useSeedExamTypes = examTypes.seed.useMutation
