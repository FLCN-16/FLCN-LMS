import { createMutation } from "react-query-kit"

import type { User } from "@flcn-lms/types/auth"

import fetch from "@/lib/fetch"

interface LoginVariables {
  username: string
  password: string
  remember: boolean
}

const useLogin = createMutation({
  mutationFn: async (variables: LoginVariables): Promise<User> => {
    const response = await fetch.post("/api/auth/login", variables)
    return response.data
  },
})

export default useLogin
