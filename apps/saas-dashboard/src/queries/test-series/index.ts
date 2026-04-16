import { router } from "react-query-kit"

import type {
  CreateTestPayload,
  CreateTestSeriesPayload,
  Test,
  TestSeries,
} from "@flcn-lms/types/test-series"

import fetch from "@/lib/fetch"

export type {
  TestSeries,
  Test,
  TestSection,
  TestSeriesEnrollment,
  CreateTestSeriesPayload,
  CreateTestPayload,
  CreateTestSectionPayload,
  TestType,
  ResultMode,
} from "@flcn-lms/types/test-series"

export const testSeries = router("testSeries", {
  list: router.query({
    fetcher: async (): Promise<TestSeries[]> => {
      const response = await fetch.get<TestSeries[]>("/api/test-series")
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<TestSeries> => {
      const response = await fetch.get<TestSeries>(
        `/api/test-series/${variables.id}`
      )
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (
      variables: CreateTestSeriesPayload
    ): Promise<TestSeries> => {
      const response = await fetch.post<TestSeries>(
        "/api/test-series",
        variables
      )
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: CreateTestSeriesPayload
    }): Promise<TestSeries> => {
      const response = await fetch.patch<TestSeries>(
        `/api/test-series/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  publish: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<TestSeries> => {
      const response = await fetch.patch<TestSeries>(
        `/api/test-series/${variables.id}/publish`
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/test-series/${variables.id}`)
    },
  }),

  tests: {
    list: router.query({
      fetcher: async (variables: { seriesId: string }): Promise<Test[]> => {
        const response = await fetch.get<Test[]>(
          `/api/test-series/${variables.seriesId}/tests`
        )
        return response.data
      },
    }),

    byId: router.query({
      fetcher: async (variables: {
        seriesId: string
        testId: string
      }): Promise<Test> => {
        const response = await fetch.get<Test>(
          `/api/test-series/${variables.seriesId}/tests/${variables.testId}`
        )
        return response.data
      },
    }),

    add: router.mutation({
      mutationFn: async (variables: {
        seriesId: string
        data: CreateTestPayload
      }): Promise<Test> => {
        const response = await fetch.post<Test>(
          `/api/test-series/${variables.seriesId}/tests`,
          variables.data
        )
        return response.data
      },
    }),

    update: router.mutation({
      mutationFn: async (variables: {
        seriesId: string
        testId: string
        data: CreateTestPayload
      }): Promise<Test> => {
        const response = await fetch.patch<Test>(
          `/api/test-series/${variables.seriesId}/tests/${variables.testId}`,
          variables.data
        )
        return response.data
      },
    }),

    publish: router.mutation({
      mutationFn: async (variables: {
        seriesId: string
        testId: string
      }): Promise<Test> => {
        const response = await fetch.patch<Test>(
          `/api/test-series/${variables.seriesId}/tests/${variables.testId}/publish`
        )
        return response.data
      },
    }),
  },
})

export const useTestSeriesList = testSeries.list.useQuery
export const useTestSeriesDetail = testSeries.byId.useQuery
export const useCreateTestSeries = testSeries.add.useMutation
export const useUpdateTestSeries = testSeries.update.useMutation
export const usePublishTestSeries = testSeries.publish.useMutation
export const useRemoveTestSeries = testSeries.remove.useMutation

export const useTestsListQuery = testSeries.tests.list
export const useTestsList = useTestsListQuery.useQuery
export const useTestDetail = testSeries.tests.byId.useQuery
export const useCreateTest = testSeries.tests.add.useMutation
export const useUpdateTest = testSeries.tests.update.useMutation
export const usePublishTest = testSeries.tests.publish.useMutation
