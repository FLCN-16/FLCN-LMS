import Cookies from "js-cookie"
import { createMutation } from "react-query-kit"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import fetch from "@/lib/fetch"

const useLogoutUser = createMutation({
  mutationFn: async () => {
    await fetch.post("/api/auth/logout")
    Cookies.remove(AUTH_COOKIE_NAME)
  },
})

export default useLogoutUser
