import { CourseMetadata, CourseModule, CourseEnrollment } from "@flcn-lms/types/test-series";
/**
 * Get all courses with pagination and filtering
 * GET /api/v1/courses
 */
export declare function listCourses(page?: number, limit?: number, category?: string, search?: string): Promise<{
    data: CourseMetadata[];
    total: number;
    page: number;
    limit: number;
}>;
/**
 * Get course detail by slug
 * GET /api/v1/courses/{slug}
 */
export declare function getCourseDetail(slug: string): Promise<CourseMetadata>;
/**
 * Get course with modules and lessons
 * GET /api/v1/courses/{slug}/modules
 */
export declare function getCourseWithModules(slug: string): Promise<CourseMetadata & {
    modules: CourseModule[];
}>;
/**
 * Search courses by query
 * GET /api/v1/courses/search
 */
export declare function searchCourses(query: string): Promise<CourseMetadata[]>;
/**
 * Get all course categories
 * GET /api/v1/course-categories
 */
export declare function getCategories(): Promise<{
    id: string;
    name: string;
    slug: string;
    courseCount?: number;
}[]>;
/**
 * Enroll in a course
 * POST /api/v1/courses/{courseId}/enroll
 */
export declare function enrollCourse(courseId: string): Promise<CourseEnrollment>;
/**
 * Get user's enrollment for a course
 * GET /api/v1/courses/{courseId}/enrollment
 */
export declare function getEnrolledCourse(courseId: string): Promise<CourseEnrollment>;
/**
 * Get specific module details
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}
 */
export declare function getModule(courseSlug: string, moduleId: string): Promise<CourseModule>;
//# sourceMappingURL=course.d.ts.map