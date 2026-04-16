import { User } from "@flcn-lms/types/auth"

import { fetcher } from "@/lib/fetcher"

/**
 * User login
 * POST /api/v1/auth/login
 */
export async function login(data: {
  email: string
  password: string
}) {
  const response = await fetcher(`/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  return response as {
    accessToken: string
    user: User
  }
}

/**
 * User registration
 * POST /api/v1/auth/register
 */
export async function register(data: {
  email: string
  password: string
  name: string
}) {
  const response = await fetcher(`/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  return response as {
    accessToken: string
    user: User
  }
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
  })

  return response as User
}

/**
 * Change user password
 * POST /api/v1/auth/change-password
 */
export async function changePassword(data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  const response = await fetcher(`/api/v1/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  return response as { success: boolean }
}
