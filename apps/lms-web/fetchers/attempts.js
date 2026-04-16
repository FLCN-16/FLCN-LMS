import { fetcher } from "@/lib/fetcher";
/**
 * Get all attempts for the authenticated user across all tests
 * GET /api/v1/attempts
 */
export async function getAllUserAttempts() {
    const response = await fetcher(`/api/v1/attempts`, {
        next: {
            tags: [`all-attempts`],
            revalidate: 60,
        },
    });
    return response;
}
/**
 * Get all attempts for a specific test
 * GET /api/v1/tests/{testId}/attempts
 */
export async function getTestAttempts(testId) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts`, {
        next: {
            tags: [`test-attempts:${testId}`],
            revalidate: 60,
        },
    });
    return response;
}
/**
 * Start a new attempt for a test
 * POST /api/v1/tests/{testId}/attempts/start
 */
export async function startAttempt(testId, payload) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || { ipAddress: "", userAgent: "" }),
    });
    return response;
}
/**
 * Get attempt details
 * GET /api/v1/tests/{testId}/attempts/{attemptId}
 */
export async function getAttempt(testId, attemptId) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts/${attemptId}`, {
        next: {
            tags: [`attempt:${testId}:${attemptId}`],
            revalidate: 30,
        },
    });
    return response;
}
/**
 * Save response for a question
 * POST /api/v1/tests/{testId}/attempts/{attemptId}/response
 */
export async function saveResponse(testId, attemptId, payload) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts/${attemptId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return response;
}
/**
 * Record tab switch (for cheating detection)
 * POST /api/v1/tests/{testId}/attempts/{attemptId}/tab-switch
 */
export async function recordTabSwitch(testId, attemptId) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts/${attemptId}/tab-switch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    return response;
}
/**
 * Get attempt result and scores
 * GET /api/v1/tests/{testId}/attempts/{attemptId}/result
 */
export async function getAttemptResult(testId, attemptId) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts/${attemptId}/result`, {
        next: {
            tags: [`attempt-result:${testId}:${attemptId}`],
            revalidate: 30,
        },
    });
    return response;
}
/**
 * Submit attempt
 * POST /api/v1/tests/{testId}/attempts/{attemptId}/submit
 */
export async function submitAttempt(testId, attemptId) {
    const response = await fetcher(`/api/v1/tests/${testId}/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    return response;
}
