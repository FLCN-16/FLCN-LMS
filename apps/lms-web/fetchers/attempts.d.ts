import { SaveResponsePayload, StartAttemptPayload, TestAttempt, TestResult } from "@flcn-lms/types/attempts";
/**
 * Get all attempts for the authenticated user across all tests
 * GET /api/v1/attempts
 */
export declare function getAllUserAttempts(): Promise<TestAttempt[]>;
/**
 * Get all attempts for a specific test
 * GET /api/v1/tests/{testId}/attempts
 */
export declare function getTestAttempts(testId: string): Promise<TestAttempt[]>;
/**
 * Start a new attempt for a test
 * POST /api/v1/tests/{testId}/attempts/start
 */
export declare function startAttempt(testId: string, payload?: StartAttemptPayload): Promise<TestAttempt>;
/**
 * Get attempt details
 * GET /api/v1/tests/{testId}/attempts/{attemptId}
 */
export declare function getAttempt(testId: string, attemptId: string): Promise<TestAttempt>;
/**
 * Save response for a question
 * POST /api/v1/tests/{testId}/attempts/{attemptId}/response
 */
export declare function saveResponse(testId: string, attemptId: string, payload: SaveResponsePayload): Promise<any>;
/**
 * Record tab switch (for cheating detection)
 * POST /api/v1/tests/{testId}/attempts/{attemptId}/tab-switch
 */
export declare function recordTabSwitch(testId: string, attemptId: string): Promise<any>;
/**
 * Get attempt result and scores
 * GET /api/v1/tests/{testId}/attempts/{attemptId}/result
 */
export declare function getAttemptResult(testId: string, attemptId: string): Promise<TestResult>;
/**
 * Submit attempt
 * POST /api/v1/tests/{testId}/attempts/{attemptId}/submit
 */
export declare function submitAttempt(testId: string, attemptId: string): Promise<TestResult>;
//# sourceMappingURL=attempts.d.ts.map