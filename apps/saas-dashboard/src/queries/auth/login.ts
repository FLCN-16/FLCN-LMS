import Cookies from "js-cookie"
import { createMutation } from "react-query-kit"

import type { User } from "@flcn-lms/types/auth"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import fetch from "@/lib/fetch"

export interface LoginVariables {
  email: string
  password: string
  remember: boolean
}

export interface LoginResponse {
  user: User
  token: string
}

const useLoginUser = createMutation({
  mutationFn: async (variables: LoginVariables): Promise<LoginResponse> => {
    const response = await fetch.post<LoginResponse>(
      "/v1/auth/login",
      variables
    )

    if (response.data.token) {
      const expires = variables.remember ? 30 : undefined

      Cookies.set(AUTH_COOKIE_NAME, response.data.token, {
        expires,
        sameSite: "lax",
        secure: import.meta.env.PROD,
      })
    }

    return response.data
  },
})

export default useLoginUser
