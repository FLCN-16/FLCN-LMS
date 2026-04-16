import type { CreateCategoryPayload, CreateCoursePayload, UpdateCategoryPayload, UpdateCoursePayload } from "@flcn-lms/types/courses";
export declare const coursesApi: {
    list: () => any;
    get: (id: string) => any;
    create: (data: CreateCoursePayload) => any;
    update: (id: string, data: UpdateCoursePayload) => any;
    remove: (id: string) => any;
    categories: {
        list: () => any;
        get: (id: string) => any;
        create: (data: CreateCategoryPayload) => any;
        update: (id: string, data: UpdateCategoryPayload) => any;
        remove: (id: string) => any;
    };
};
/**
 * Instructor-specific course API
 * All endpoints include ownership verification on the backend
 * Instructors can only access their own courses
 * Admins can access any instructor's courses
 */
export declare const instructorCoursesApi: {
    /**
     * List courses for a specific instructor
     * @param instructorId - The UUID of the instructor
     * @param page - Page number (optional, default 1)
     * @param limit - Items per page (optional, default 10)
     */
    listByInstructor: (instructorId: string, page?: number, limit?: number) => any;
    /**
     * Get a specific course owned by an instructor (for editing)
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    get: (instructorId: string, courseId: string) => any;
    /**
     * Update a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     * @param data - The course update payload
     */
    update: (instructorId: string, courseId: string, data: UpdateCoursePayload) => any;
    /**
     * Delete a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    delete: (instructorId: string, courseId: string) => any;
    /**
     * Publish a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    publish: (instructorId: string, courseId: string) => any;
    /**
     * Archive a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    archive: (instructorId: string, courseId: string) => any;
};
//# sourceMappingURL=courses.d.ts.map