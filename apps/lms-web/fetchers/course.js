import { fetcher } from "@/lib/fetcher";
/**
 * Get all courses with pagination and filtering
 * GET /api/v1/courses
 */
export async function listCourses(page = 1, limit = 12, category, search) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(category && { category }),
        ...(search && { search }),
    });
    const response = await fetcher(`/api/v1/courses?${params}`, {
        next: {
            tags: ["courses", "courses-list"],
            revalidate: 3600,
        },
    });
    return response;
}
/**
 * Get course detail by slug
 * GET /api/v1/courses/{slug}
 */
export async function getCourseDetail(slug) {
    const response = await fetcher(`/api/v1/courses/${slug}`, {
        next: {
            tags: [`course:${slug}`],
            revalidate: 3600,
        },
    });
    return response;
}
/**
 * Get course with modules and lessons
 * GET /api/v1/courses/{slug}/modules
 */
export async function getCourseWithModules(slug) {
    const response = await fetcher(`/api/v1/courses/${slug}/modules`, {
        next: {
            tags: [`course:${slug}:modules`],
            revalidate: 3600,
        },
    });
    return response;
}
/**
 * Search courses by query
 * GET /api/v1/courses/search
 */
export async function searchCourses(query) {
    const response = await fetcher(`/api/v1/courses/search?q=${query}`, {
        next: {
            tags: ["courses-search", `courses-search:${query}`],
            revalidate: 1800,
        },
    });
    return response;
}
/**
 * Get all course categories
 * GET /api/v1/course-categories
 */
export async function getCategories() {
    const response = await fetcher(`/api/v1/course-categories`, {
        next: {
            tags: ["course-categories"],
            revalidate: 7200,
        },
    });
    return response;
}
/**
 * Enroll in a course
 * POST /api/v1/courses/{courseId}/enroll
 */
export async function enrollCourse(courseId) {
    const response = await fetcher(`/api/v1/courses/${courseId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    return response;
}
/**
 * Get user's enrollment for a course
 * GET /api/v1/courses/{courseId}/enrollment
 */
export async function getEnrolledCourse(courseId) {
    const response = await fetcher(`/api/v1/courses/${courseId}/enrollment`, {
        next: {
            tags: [`enrollment:${courseId}`],
            revalidate: 300,
        },
    });
    return response;
}
/**
 * Get specific module details
 * GET /api/v1/courses/{courseSlug}/modules/{moduleId}
 */
export async function getModule(courseSlug, moduleId) {
    const response = await fetcher(`/api/v1/courses/${courseSlug}/modules/${moduleId}`, {
        next: {
            tags: [`module:${courseSlug}:${moduleId}`],
            revalidate: 3600,
        },
    });
    return response;
}
