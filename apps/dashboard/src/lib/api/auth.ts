import type { User } from "@flcn-lms/types/auth"

import fetch from "@/lib/fetch"

export async function loginUser(
  email: string,
  password: string,
  remember: boolean
): Promise<User> {
  return fetch
    .post("/api/auth/login", { email, password, remember })
    .then((r) => r.data)
}

export async function logoutUser(): Promise<void> {
  return fetch.post("/api/auth/logout").then((r) => r.data)
}
