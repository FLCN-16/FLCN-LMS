import { createQuery } from "react-query-kit"

import type { User } from "@flcn-lms/types/auth"

import fetch from "@/lib/fetch"

const useSession = createQuery({
  queryKey: ["auth", "session"],
  fetcher: async (): Promise<User> => {
    const response = await fetch.get("/api/auth/session")
    return response.data
  },
})

export default useSession
