import { router } from "react-query-kit"

import fetch from "@/lib/fetch"

export interface AnalyticsOverview {
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  activeEnrollments: number
  growthRate: number
}

export interface CourseAnalytics {
  courseId: string
  title: string
  totalSales: number
  totalRevenue: number
  avgProgress: number
  completionRate: number
}

export interface TestAnalytics {
  testId: string
  title: string
  totalAttempts: number
  avgScore: number
  passRate: number
}

export const analytics = router("analytics", {
  overview: router.query({
    fetcher: async (): Promise<AnalyticsOverview> => {
      const response = await fetch.get<AnalyticsOverview>(
        "/api/v1/analytics/overview"
      )
      return response.data
    },
  }),

  courseStats: router.query({
    fetcher: async (variables: { id: string }): Promise<CourseAnalytics> => {
      const response = await fetch.get<CourseAnalytics>(
        `/api/v1/analytics/courses/${variables.id}`
      )
      return response.data
    },
  }),

  testStats: router.query({
    fetcher: async (variables: { id: string }): Promise<TestAnalytics> => {
      const response = await fetch.get<TestAnalytics>(
        `/api/v1/analytics/tests/${variables.id}`
      )
      return response.data
    },
  }),
})

export const useAnalyticsOverview = analytics.overview.useQuery
export const useCourseAnalytics = analytics.courseStats.useQuery
export const useTestAnalytics = analytics.testStats.useQuery
