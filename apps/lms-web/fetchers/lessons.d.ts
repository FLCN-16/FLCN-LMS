import { CourseLesson, LessonProgress } from "@flcn-lms/types/test-series";
/**
 * Get specific lesson details
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}
 */
export declare function getLesson(courseSlug: string, moduleId: string, lessonId: string): Promise<CourseLesson>;
/**
 * Mark lesson as complete
 * POST /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/complete
 */
export declare function markLessonComplete(courseSlug: string, moduleId: string, lessonId: string): Promise<LessonProgress>;
/**
 * Get lesson progress
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/progress
 */
export declare function getLessonProgress(courseSlug: string, moduleId: string, lessonId: string): Promise<LessonProgress>;
/**
 * Update watched duration for a lesson
 * PATCH /api/v1/courses/{courseSlug}/modules/{moduleId}/lessons/{lessonId}/progress
 */
export declare function updateLessonProgress(courseSlug: string, moduleId: string, lessonId: string, data: {
    watchedSecs?: number;
    isCompleted?: boolean;
}): Promise<LessonProgress>;
//# sourceMappingURL=lessons.d.ts.map