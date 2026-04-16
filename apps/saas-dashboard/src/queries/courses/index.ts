import { router } from "react-query-kit"

import type {
  CreateCategoryPayload,
  CreateCoursePayload,
  LiveSessionStatus,
  UpdateCategoryPayload,
  UpdateCoursePayload,
} from "@flcn-lms/types/courses"
import type {
  CourseLesson,
  CourseMetadata,
  CourseModule,
} from "@flcn-lms/types/test-series"

import fetch from "@/lib/fetch"

export interface CourseCategory {
  id: string
  tenantId: string
  slug: string
  name: string
  description?: string | null
  iconUrl?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string[] | null
  seoImageUrl?: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Course extends CourseMetadata {
  category?: CourseCategory
  modules?: CourseModuleWithLessons[]
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons?: CourseLesson[]
}

export interface LiveSession {
  id: string
  tenantId: string
  courseId: string
  instructorId: string
  title: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  recordingUrl?: string | null
  livekitRoomId?: string | null
  hlsUrl?: string | null
  status: LiveSessionStatus
  maxParticipants?: number | null
}

export type CreateCourseInput = Omit<CreateCoursePayload, "instructorId">
export type UpdateCourseInput = Omit<UpdateCoursePayload, "instructorId">

export const courses = router("courses", {
  categories: {
    list: router.query({
      fetcher: async (): Promise<CourseCategory[]> => {
        const response = await fetch.get<CourseCategory[]>(
          "/v1/courses/categories"
        )
        return response.data
      },
    }),

    byId: router.query({
      fetcher: async (variables: { id: string }): Promise<CourseCategory> => {
        const response = await fetch.get<CourseCategory>(
          `/v1/courses/categories/${variables.id}`
        )
        return response.data
      },
    }),

    add: router.mutation({
      mutationFn: async (
        variables: CreateCategoryPayload
      ): Promise<CourseCategory> => {
        const response = await fetch.post<CourseCategory>(
          "/v1/courses/categories",
          variables
        )
        return response.data
      },
    }),

    update: router.mutation({
      mutationFn: async (variables: {
        id: string
        data: UpdateCategoryPayload
      }): Promise<CourseCategory> => {
        const response = await fetch.patch<CourseCategory>(
          `/v1/courses/categories/${variables.id}`,
          variables.data
        )
        return response.data
      },
    }),

    remove: router.mutation({
      mutationFn: async (variables: { id: string }): Promise<void> => {
        await fetch.delete(`/v1/courses/categories/${variables.id}`)
      },
    }),
  },

  list: router.query({
    fetcher: async (): Promise<Course[]> => {
      const response = await fetch.get<Course[]>("/v1/courses")
      return response.data
    },
  }),

  byId: router.query({
    fetcher: async (variables: { id: string }): Promise<Course> => {
      const response = await fetch.get<Course>(`/api/courses/${variables.id}`)
      return response.data
    },
  }),

  add: router.mutation({
    mutationFn: async (variables: CreateCourseInput): Promise<Course> => {
      const response = await fetch.post<Course>("/api/courses", variables)
      return response.data
    },
  }),

  update: router.mutation({
    mutationFn: async (variables: {
      id: string
      data: UpdateCourseInput
    }): Promise<Course> => {
      const response = await fetch.patch<Course>(
        `/api/courses/${variables.id}`,
        variables.data
      )
      return response.data
    },
  }),

  publish: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<Course> => {
      const response = await fetch.post<Course>(
        `/api/courses/${variables.id}/publish`
      )
      return response.data
    },
  }),

  remove: router.mutation({
    mutationFn: async (variables: { id: string }): Promise<void> => {
      await fetch.delete(`/api/courses/${variables.id}`)
    },
  }),

  liveSessions: {
    list: router.query({
      fetcher: async (variables: {
        courseId: string
      }): Promise<LiveSession[]> => {
        const response = await fetch.get<LiveSession[]>(
          "/api/courses/live-sessions",
          {
            params: { courseId: variables.courseId },
          }
        )
        return response.data
      },
    }),
  },
})

export const useCourseCategoriesList = courses.categories.list.useQuery
export const useCourseCategoryDetail = courses.categories.byId.useQuery
export const useCreateCourseCategory = courses.categories.add.useMutation
export const useUpdateCourseCategory = courses.categories.update.useMutation
export const useDeleteCourseCategory = courses.categories.remove.useMutation

export const useCoursesList = courses.list.useQuery
export const useCourseDetail = courses.byId.useQuery
export const useCreateCourse = courses.add.useMutation
export const useUpdateCourse = courses.update.useMutation
export const usePublishCourse = courses.publish.useMutation
export const useDeleteCourse = courses.remove.useMutation
export const useCourseLiveSessions = courses.liveSessions.list.useQuery

export type { CreateCategoryPayload, UpdateCategoryPayload, LiveSessionStatus }
