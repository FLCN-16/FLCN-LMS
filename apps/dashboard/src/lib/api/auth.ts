import type { User } from "@flcn-lms/types/auth"

import fetch from "@/lib/fetch"

export async function loginUser(
  username: string,
  password: string,
  remember: boolean
): Promise<User> {
  return fetch
    .post("/api/auth/login", { username, password, remember })
    .then((r) => r.data)
}

export async function logoutUser(): Promise<void> {
  return fetch.post("/api/auth/logout").then((r) => r.data)
}
