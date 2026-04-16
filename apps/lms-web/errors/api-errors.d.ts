/**
 * API Error Classes for different HTTP status codes
 * Used by fetcher.ts to provide typed error handling
 */
/**
 * Base API Error class
 */
export declare class ApiError extends Error {
    readonly status: number;
    readonly statusText: string;
    constructor(status: number, statusText: string, message?: string);
}
/**
 * 400 Bad Request - Invalid request parameters or malformed data
 */
export declare class BadRequestError extends ApiError {
    constructor(message?: string);
}
/**
 * 401 Unauthorized - Authentication required or invalid credentials
 */
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string);
}
/**
 * 403 Forbidden - User lacks permission for the resource
 */
export declare class ForbiddenError extends ApiError {
    constructor(message?: string);
}
/**
 * 404 Not Found - Resource does not exist
 */
export declare class NotFoundError extends ApiError {
    constructor(message?: string);
}
/**
 * 409 Conflict - Request conflicts with current state
 */
export declare class ConflictError extends ApiError {
    constructor(message?: string);
}
/**
 * 422 Unprocessable Entity - Validation failed
 */
export declare class ValidationError extends ApiError {
    errors?: Record<string, string[]>;
    constructor(message?: string, errors?: Record<string, string[]>);
}
/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export declare class RateLimitError extends ApiError {
    retryAfter?: number;
    constructor(message?: string, retryAfter?: number);
}
/**
 * 500 Internal Server Error - Server error
 */
export declare class InternalServerError extends ApiError {
    constructor(message?: string);
}
/**
 * 503 Service Unavailable - Server temporarily unavailable
 */
export declare class ServiceUnavailableError extends ApiError {
    constructor(message?: string);
}
/**
 * Network Error - Connection or network issue
 */
export declare class NetworkError extends Error {
    constructor(message?: string);
}
/**
 * Parse Error - Failed to parse response
 */
export declare class ParseError extends Error {
    constructor(message?: string);
}
/**
 * Get appropriate error class based on HTTP status code
 */
export declare function getErrorByStatus(status: number, statusText: string, message?: string): ApiError;
//# sourceMappingURL=api-errors.d.ts.map