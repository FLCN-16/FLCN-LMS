import fetch from "../fetch";
export const coursesApi = {
    list: () => fetch.get("/api/courses").then((r) => r.data),
    get: (id) => fetch.get(`/api/courses/${id}`).then((r) => r.data),
    create: (data) => fetch.post("/api/courses", data).then((r) => r.data),
    update: (id, data) => fetch.patch(`/api/courses/${id}`, data).then((r) => r.data),
    remove: (id) => fetch.delete(`/api/courses/${id}`),
    categories: {
        list: () => fetch.get("/api/course-categories").then((r) => r.data),
        get: (id) => fetch.get(`/api/course-categories/${id}`).then((r) => r.data),
        create: (data) => fetch.post("/api/course-categories", data).then((r) => r.data),
        update: (id, data) => fetch.patch(`/api/course-categories/${id}`, data).then((r) => r.data),
        remove: (id) => fetch.delete(`/api/course-categories/${id}`),
    },
};
/**
 * Instructor-specific course API
 * All endpoints include ownership verification on the backend
 * Instructors can only access their own courses
 * Admins can access any instructor's courses
 */
export const instructorCoursesApi = {
    /**
     * List courses for a specific instructor
     * @param instructorId - The UUID of the instructor
     * @param page - Page number (optional, default 1)
     * @param limit - Items per page (optional, default 10)
     */
    listByInstructor: (instructorId, page, limit) => fetch
        .get(`/api/instructors/${instructorId}/courses`, {
        params: {
            ...(page && { page }),
            ...(limit && { limit }),
        },
    })
        .then((r) => r.data),
    /**
     * Get a specific course owned by an instructor (for editing)
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    get: (instructorId, courseId) => fetch
        .get(`/api/instructors/${instructorId}/courses/${courseId}`)
        .then((r) => r.data),
    /**
     * Update a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     * @param data - The course update payload
     */
    update: (instructorId, courseId, data) => fetch
        .patch(`/api/instructors/${instructorId}/courses/${courseId}`, data)
        .then((r) => r.data),
    /**
     * Delete a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    delete: (instructorId, courseId) => fetch.delete(`/api/instructors/${instructorId}/courses/${courseId}`),
    /**
     * Publish a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    publish: (instructorId, courseId) => fetch
        .post(`/api/instructors/${instructorId}/courses/${courseId}/publish`)
        .then((r) => r.data),
    /**
     * Archive a course owned by an instructor
     * @param instructorId - The UUID of the instructor
     * @param courseId - The UUID of the course
     */
    archive: (instructorId, courseId) => fetch
        .post(`/api/instructors/${instructorId}/courses/${courseId}/archive`)
        .then((r) => r.data),
};
