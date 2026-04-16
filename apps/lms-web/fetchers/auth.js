import { fetcher } from "@/lib/fetcher";
/**
 * User login
 * POST /api/v1/auth/login
 */
export async function login(data) {
    const response = await fetcher(`/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response;
}
/**
 * User registration
 * POST /api/v1/auth/register
 */
export async function register(data) {
    const response = await fetcher(`/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response;
}
/**
 * Get current user session
 * GET /api/v1/auth/session
 */
export async function getSession() {
    const response = await fetcher(`/api/v1/auth/session`, {
        next: {
            tags: ["auth-session"],
            revalidate: 300,
        },
    });
    return response;
}
/**
 * Change user password
 * POST /api/v1/auth/change-password
 */
export async function changePassword(data) {
    const response = await fetcher(`/api/v1/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response;
}
