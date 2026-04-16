import { fetcher } from "@/lib/fetcher";
/**
 * Get specific lesson details
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}
 */
export async function getLesson(courseSlug, moduleId, lessonId) {
    const response = await fetcher(`/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}`, {
        next: {
            tags: [`lesson:${courseSlug}:${moduleId}:${lessonId}`],
            revalidate: 3600,
        },
    });
    return response;
}
/**
 * Mark lesson as complete
 * POST /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/complete
 */
export async function markLessonComplete(courseSlug, moduleId, lessonId) {
    const response = await fetcher(`/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    return response;
}
/**
 * Get lesson progress
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/progress
 */
export async function getLessonProgress(courseSlug, moduleId, lessonId) {
    const response = await fetcher(`/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}/progress`, {
        next: {
            tags: [`lesson-progress:${courseSlug}:${moduleId}:${lessonId}`],
            revalidate: 300,
        },
    });
    return response;
}
/**
 * Update watched duration for a lesson
 * PATCH /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/progress
 */
export async function updateLessonProgress(courseSlug, moduleId, lessonId, data) {
    const response = await fetcher(`/api/v1/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response;
}
