import Cookies from "js-cookie"
import { createQuery } from "react-query-kit"

import type { User } from "@flcn-lms/types/auth"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import fetch from "@/lib/fetch"

const useSession = createQuery({
  queryKey: ["auth", "session"],
  fetcher: async (): Promise<User | null> => {
    const token = Cookies.get(AUTH_COOKIE_NAME)

    if (!token) {
      return null
    }

    const response = await fetch.get<User>("/api/v1/auth/admin/session")
    return response.data
  },
})

export default useSession
