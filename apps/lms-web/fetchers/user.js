import { fetcher } from "@/lib/fetcher";
/**
 * Get user profile
 * GET /api/v1/user/profile
 */
export async function getProfile() {
    const response = await fetcher(`/api/v1/user/profile`, {
        next: {
            tags: ["user-profile"],
            revalidate: 300,
        },
    });
    return response;
}
/**
 * Update user profile
 * PATCH /api/v1/user/profile
 */
export async function updateProfile(data) {
    const response = await fetcher(`/api/v1/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response;
}
/**
 * Get user statistics
 * GET /api/v1/user/stats
 */
export async function getUserStats() {
    const response = await fetcher(`/api/v1/user/stats`, {
        next: {
            tags: ["user-stats"],
            revalidate: 600,
        },
    });
    return response;
}
/**
 * Get user's enrolled courses
 * GET /api/v1/user/enrollments
 */
export async function getEnrolledCourses(page = 1, limit = 10) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    const response = await fetcher(`/api/v1/user/enrollments?${params}`, {
        next: {
            tags: ["user-enrollments"],
            revalidate: 300,
        },
    });
    return response;
}
/**
 * Get user settings
 * GET /api/v1/user/settings
 */
export async function getUserSettings() {
    const response = await fetcher(`/api/v1/user/settings`, {
        next: {
            tags: ["user-settings"],
            revalidate: 300,
        },
    });
    return response;
}
/**
 * Update user settings
 * PATCH /api/v1/user/settings
 */
export async function updateSettings(data) {
    const response = await fetcher(`/api/v1/user/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response;
}
