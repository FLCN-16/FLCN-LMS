import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

export interface Batch {
  id: string
  tenantId: string
  instructorId?: string | null
  courseId?: string | null
  name: string
  description?: string | null
  capacity?: number | null
  studentCount: number
  startDate?: string | null
  endDate?: string | null
  status: "active" | "inactive" | "completed"
  createdAt: string
  updatedAt: string
}

export const batches = router("batches", {
  list: router.query({
    fetcher: async (): Promise<Batch[]> => {
      const response = await fetch.get<Batch[]>("/api/v1/batches")
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<Batch> => {
      const response = await fetch.get<Batch>(
        `/api/v1/batches/${variables.id}`
      )
      return response.data
    },
  }),

  students: router.query({
    fetcher: async (variables: { id: string; page?: number; limit?: number }): Promise<any> => {
      const response = await fetch.get(
        `/api/v1/batches/${variables.id}/students`,
        { params: { page: variables.page, limit: variables.limit } }
      )
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: any): Promise<Batch> => {
      const response = await fetch.post<Batch>(
        "/api/v1/batches",
        variables
      )
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: any
    }): Promise<Batch> => {
      const response = await fetch.patch<Batch>(
        `/api/v1/batches/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  enroll: router.mutation({
    mutationFn: async (variables: {
      id: string
      studentIds: string[]
    }): Promise<any> => {
      const response = await fetch.post(
        `/api/v1/batches/${variables.id}/enroll`,
        { studentIds: variables.studentIds }
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/v1/batches/${variables.id}`)
    },
  }),
})

export const useBatchesList = batches.list.useQuery
export const useBatchDetail = batches.byId.useQuery
export const useBatchStudents = batches.students.useQuery
export const useCreateBatch = batches.add.useMutation
export const useUpdateBatch = batches.update.useMutation
export const useEnrollBatchStudents = batches.enroll.useMutation
export const useDeleteBatch = batches.remove.useMutation
