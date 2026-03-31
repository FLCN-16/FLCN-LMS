import { createMutation } from "react-query-kit"

import fetch from "@/lib/fetch"

const useLogout = createMutation({
  mutationFn: async () => {
    const response = await fetch.post("/api/auth/logout")
    return response.data
  },
})

export default useLogout
