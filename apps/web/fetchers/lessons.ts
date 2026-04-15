import {
  CourseLesson,
  LessonProgress,
} from "@flcn-lms/types/test-series"

import { fetcher } from "@/lib/fetcher"

/**
 * Get specific lesson details
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}
 */
export async function getLesson(
  courseSlug: string,
  moduleId: string,
  lessonId: string
) {
  const response = await fetcher(
    `/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}`,
    {
      next: {
        tags: [`lesson:${courseSlug}:${moduleId}:${lessonId}`],
        revalidate: 3600,
      },
    }
  )

  return response as CourseLesson
}

/**
 * Mark lesson as complete
 * POST /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/complete
 */
export async function markLessonComplete(
  courseSlug: string,
  moduleId: string,
  lessonId: string
) {
  const response = await fetcher(
    `/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }
  )

  return response as LessonProgress
}

/**
 * Get lesson progress
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/progress
 */
export async function getLessonProgress(
  courseSlug: string,
  moduleId: string,
  lessonId: string
) {
  const response = await fetcher(
    `/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}/progress`,
    {
      next: {
        tags: [`lesson-progress:${courseSlug}:${moduleId}:${lessonId}`],
        revalidate: 300,
      },
    }
  )

  return response as LessonProgress
}

/**
 * Update watched duration for a lesson
 * PATCH /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/progress
 */
export async function updateLessonProgress(
  courseSlug: string,
  moduleId: string,
  lessonId: string,
  data: {
    watchedSecs?: number
    isCompleted?: boolean
  }
) {
  const response = await fetcher(
    `/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}/progress`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )

  return response as LessonProgress
}
