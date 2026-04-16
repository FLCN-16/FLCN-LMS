import {
  ApiError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  getErrorByStatus,
  InternalServerError,
  NetworkError,
  ParseError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError,
  ValidationError,
} from "@/errors/api-errors"

import { COOKIES } from "./cookies"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Fetch timeout in milliseconds (30 seconds)
const FETCH_TIMEOUT = 30000

export type FetcherConfig = RequestInit & {
  /**
   * Whether to include credentials (cookies) in the request.
   * Defaults to true for automatic httpOnly cookie inclusion.
   */
  credentials?: RequestCredentials
  /**
   * Custom timeout in milliseconds. Defaults to 30s.
   */
  timeout?: number
}

/**
 * Inject authentication token from cookies into request headers
 * Works on both server-side (using next/headers) and client-side (using cookies-next)
 *
 * @param headers - Headers object to inject token into
 */
async function injectAuthToken(headers: Record<string, string>): Promise<void> {
  const cookieName = COOKIES.AUTH_TOKEN

  try {
    // Server-side: Use next/headers
    if (typeof window === "undefined") {
      await import("next/headers").then(async ({ cookies }) => {
        const cookiesStore = await cookies()
        const authApiToken = cookiesStore.get(cookieName)?.value

        if (authApiToken) {
          headers["Authorization"] = `Bearer ${authApiToken}`
        }
      })
    } else {
      // Client-side: Use cookies-next/client
      await import("cookies-next/client").then(({ getCookie }) => {
        const authApiToken = getCookie(cookieName)

        if (authApiToken) {
          headers["Authorization"] = `Bearer ${authApiToken}`
        }
      })
    }
  } catch (error) {
    // Silently ignore cookie errors - allows request to proceed even if cookie injection fails
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to inject auth token:", error)
    }
  }
}

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
export async function fetcher<T = unknown>(
  url: string,
  config: FetcherConfig = {}
): Promise<T> {
  // Convert relative URLs to absolute URLs
  const absoluteUrl = url.startsWith("http") ? url : `${API_BASE}${url}`

  // Prepare headers with defaults
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Merge existing headers (handle Headers object and plain objects)
  if (config.headers) {
    if (config.headers instanceof Headers) {
      config.headers.forEach((value, key) => {
        headers[key] = value
      })
    } else {
      Object.assign(headers, config.headers as Record<string, string>)
    }
  }

  // Inject auth token from cookies (works on both server and client)
  await injectAuthToken(headers)

  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutMs = config.timeout ?? FETCH_TIMEOUT
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // Prepare final fetch config
  const finalConfig: RequestInit = {
    ...config,
    headers,
    // Include credentials (httpOnly cookies) by default
    credentials: config.credentials ?? "include",
    // Add abort signal for timeout
    signal: controller.signal,
  }

  let response: Response

  // Handle network errors
  try {
    response = await fetch(absoluteUrl, finalConfig)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("abort")) {
      throw new NetworkError(`Request timeout after ${timeoutMs}ms for ${url}`)
    }
    if (error instanceof TypeError) {
      throw new NetworkError(`Network error fetching ${url}: ${error.message}`)
    }
    throw new NetworkError(
      `Network error fetching ${url}: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  } finally {
    clearTimeout(timeoutId)
  }

  // Parse response body
  let responseData: unknown

  try {
    responseData = await response.json()
  } catch (error) {
    throw new ParseError(
      `Failed to parse JSON response from ${url}: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }

  // Handle error status codes
  if (!response.ok) {
    const errorMessage =
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
        ? String(responseData.message)
        : `${response.status} ${response.statusText}`

    const error = getErrorByStatus(
      response.status,
      response.statusText,
      errorMessage
    )

    // Attach additional validation error details if available
    if (
      error instanceof ValidationError &&
      typeof responseData === "object" &&
      responseData !== null &&
      "errors" in responseData
    ) {
      error.errors = responseData.errors as Record<string, string[]>
    }

    // Attach retry-after header for rate limit errors
    if (error instanceof RateLimitError) {
      const retryAfter = response.headers.get("Retry-After")
      if (retryAfter) {
        error.retryAfter = parseInt(retryAfter, 10)
      }
    }

    throw error
  }

  // Return parsed response data
  return responseData as T
}

/**
 * Convenience wrapper for GET requests
 *
 * @example
 * ```ts
 * const user = await fetcherGet<User>('/api/v1/user/profile')
 * ```
 */
export async function fetcherGet<T = unknown>(
  url: string,
  config?: FetcherConfig
): Promise<T> {
  return fetcher<T>(url, { ...config, method: "GET" })
}

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
export async function fetcherPost<T = unknown>(
  url: string,
  config?: FetcherConfig
): Promise<T> {
  return fetcher<T>(url, { ...config, method: "POST" })
}

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
export async function fetcherPatch<T = unknown>(
  url: string,
  config?: FetcherConfig
): Promise<T> {
  return fetcher<T>(url, { ...config, method: "PATCH" })
}

/**
 * Convenience wrapper for PUT requests
 */
export async function fetcherPut<T = unknown>(
  url: string,
  config?: FetcherConfig
): Promise<T> {
  return fetcher<T>(url, { ...config, method: "PUT" })
}

/**
 * Convenience wrapper for DELETE requests
 *
 * @example
 * ```ts
 * await fetcherDelete('/api/v1/courses/123')
 * ```
 */
export async function fetcherDelete<T = unknown>(
  url: string,
  config?: FetcherConfig
): Promise<T> {
  return fetcher<T>(url, { ...config, method: "DELETE" })
}

// Re-export error classes for use in components
export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  NetworkError,
  ParseError,
  getErrorByStatus,
}
