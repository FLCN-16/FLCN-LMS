/**
 * API Error Classes for different HTTP status codes
 * Used by fetcher.ts to provide typed error handling
 */
/**
 * Base API Error class
 */
export class ApiError extends Error {
    status;
    statusText;
    constructor(status, statusText, message) {
        super(message || `API Error: ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.name = "ApiError";
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
/**
 * 400 Bad Request - Invalid request parameters or malformed data
 */
export class BadRequestError extends ApiError {
    constructor(message = "Bad Request: Invalid request parameters") {
        super(400, "Bad Request", message);
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
/**
 * 401 Unauthorized - Authentication required or invalid credentials
 */
export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized: Please log in") {
        super(401, "Unauthorized", message);
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
/**
 * 403 Forbidden - User lacks permission for the resource
 */
export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden: You don't have permission to access this resource") {
        super(403, "Forbidden", message);
        this.name = "ForbiddenError";
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
/**
 * 404 Not Found - Resource does not exist
 */
export class NotFoundError extends ApiError {
    constructor(message = "Not Found: Resource does not exist") {
        super(404, "Not Found", message);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
/**
 * 409 Conflict - Request conflicts with current state
 */
export class ConflictError extends ApiError {
    constructor(message = "Conflict: Request conflicts with current state") {
        super(409, "Conflict", message);
        this.name = "ConflictError";
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
/**
 * 422 Unprocessable Entity - Validation failed
 */
export class ValidationError extends ApiError {
    errors;
    constructor(message = "Validation Error: The request contains invalid data", errors) {
        super(422, "Unprocessable Entity", message);
        this.name = "ValidationError";
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class RateLimitError extends ApiError {
    retryAfter;
    constructor(message = "Rate Limit Exceeded: Too many requests, please try again later", retryAfter) {
        super(429, "Too Many Requests", message);
        this.name = "RateLimitError";
        this.retryAfter = retryAfter;
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
/**
 * 500 Internal Server Error - Server error
 */
export class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error: Something went wrong") {
        super(500, "Internal Server Error", message);
        this.name = "InternalServerError";
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
/**
 * 503 Service Unavailable - Server temporarily unavailable
 */
export class ServiceUnavailableError extends ApiError {
    constructor(message = "Service Unavailable: The service is temporarily unavailable") {
        super(503, "Service Unavailable", message);
        this.name = "ServiceUnavailableError";
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}
/**
 * Network Error - Connection or network issue
 */
export class NetworkError extends Error {
    constructor(message = "Network Error: Failed to reach the server") {
        super(message);
        this.name = "NetworkError";
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
/**
 * Parse Error - Failed to parse response
 */
export class ParseError extends Error {
    constructor(message = "Parse Error: Failed to parse server response") {
        super(message);
        this.name = "ParseError";
        Object.setPrototypeOf(this, ParseError.prototype);
    }
}
/**
 * Get appropriate error class based on HTTP status code
 */
export function getErrorByStatus(status, statusText, message) {
    switch (status) {
        case 400:
            return new BadRequestError(message);
        case 401:
            return new UnauthorizedError(message);
        case 403:
            return new ForbiddenError(message);
        case 404:
            return new NotFoundError(message);
        case 409:
            return new ConflictError(message);
        case 422:
            return new ValidationError(message);
        case 429:
            return new RateLimitError(message);
        case 500:
            return new InternalServerError(message);
        case 503:
            return new ServiceUnavailableError(message);
        default:
            return new ApiError(status, statusText, message);
    }
}
