import { ApiError, BadRequestError, ConflictError, ForbiddenError, getErrorByStatus, InternalServerError, NetworkError, ParseError, RateLimitError, ServiceUnavailableError, UnauthorizedError, ValidationError } from "@/errors/api-errors";
export type FetcherConfig = RequestInit & {
    /**
     * Whether to include credentials (cookies) in the request.
     * Defaults to true for automatic httpOnly cookie inclusion.
     */
    credentials?: RequestCredentials;
};
/**
 * Enhanced fetch wrapper with:
 * - Generic typing for response data
 * - Automatic JWT/auth token injection from httpOnly cookies (server & client)
 * - Comprehensive error handling with typed error classes
 * - Support for both Server Components and Client Components
 *
 * @template T - The expected response data type
 * @param url - API endpoint (relative or absolute)
 * @param config - Fetch configuration options
 * @returns Parsed response data typed as T
 *
 * @throws {UnauthorizedError} 401 - Authentication required
 * @throws {ForbiddenError} 403 - Permission denied
 * @throws {ValidationError} 422 - Validation failed
 * @throws {NotFoundError} 404 - Resource not found
 * @throws {RateLimitError} 429 - Rate limit exceeded
 * @throws {ApiError} - Generic API error for other HTTP errors
 * @throws {NetworkError} - Network connectivity issues
 * @throws {ParseError} - Response parsing failed
 *
 * @example
 * ```ts
 * // Simple GET request
 * const user = await fetcher<User>('/api/v1/user/profile')
 *
 * // POST with body
 * const course = await fetcher<Course>('/api/v1/courses', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'Web Dev 101' })
 * })
 *
 * // Error handling
 * try {
 *   const data = await fetcher<Data>('/api/v1/data')
 * } catch (error) {
 *   if (error instanceof UnauthorizedError) {
 *     redirect('/auth/login')
 *   } else if (error instanceof ValidationError) {
 *     console.error('Validation errors:', error.errors)
 *   }
 * }
 * ```
 */
export declare function fetcher<T = unknown>(url: string, config?: FetcherConfig): Promise<T>;
/**
 * Convenience wrapper for GET requests
 *
 * @example
 * ```ts
 * const user = await fetcherGet<User>('/api/v1/user/profile')
 * ```
 */
export declare function fetcherGet<T = unknown>(url: string, config?: FetcherConfig): Promise<T>;
/**
 * Convenience wrapper for POST requests
 *
 * @example
 * ```ts
 * const result = await fetcherPost<Course>('/api/v1/courses', {
 *   body: JSON.stringify({ title: 'New Course' })
 * })
 * ```
 */
export declare function fetcherPost<T = unknown>(url: string, config?: FetcherConfig): Promise<T>;
/**
 * Convenience wrapper for PATCH requests
 *
 * @example
 * ```ts
 * const updated = await fetcherPatch<Course>('/api/v1/courses/123', {
 *   body: JSON.stringify({ title: 'Updated Title' })
 * })
 * ```
 */
export declare function fetcherPatch<T = unknown>(url: string, config?: FetcherConfig): Promise<T>;
/**
 * Convenience wrapper for PUT requests
 */
export declare function fetcherPut<T = unknown>(url: string, config?: FetcherConfig): Promise<T>;
/**
 * Convenience wrapper for DELETE requests
 *
 * @example
 * ```ts
 * await fetcherDelete('/api/v1/courses/123')
 * ```
 */
export declare function fetcherDelete<T = unknown>(url: string, config?: FetcherConfig): Promise<T>;
export { ApiError, BadRequestError, UnauthorizedError, ForbiddenError, ConflictError, ValidationError, RateLimitError, InternalServerError, ServiceUnavailableError, NetworkError, ParseError, getErrorByStatus, };
//# sourceMappingURL=fetcher.d.ts.map