import Cookies from "js-cookie"
import { createMutation } from "react-query-kit"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import fetch from "@/lib/fetch"

const useLogoutUser = createMutation({
  mutationFn: async () => {
    try {
      await fetch.post("/v1/auth/logout")
    } catch {
      // Logout endpoint might fail, but we still want to clear local tokens
    }
    Cookies.remove(AUTH_COOKIE_NAME)
  },
})

export default useLogoutUser
