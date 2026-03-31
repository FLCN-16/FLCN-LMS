import React from "react"

import type { User } from "@flcn-lms/types/auth"

import { loginUser, logoutUser } from "@/lib/api/auth"
import useSession from "@/queries/auth/session"

interface AuthContextProps {
  isLoading: boolean
  isAuthenticated: boolean
  user: User | undefined
  login: (username: string, password: string, remember: boolean) => void
  logout: () => void
  revalidateSession: () => void
}

/* eslint-disable-next-line react-refresh/only-export-components */
export const AuthContext = React.createContext<AuthContextProps | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: user,
    isLoading: isLoadingSession,
    refetch: revalidateSession,
  } = useSession({
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5, // 5 minute
  })

  async function login(username: string, password: string, remember: boolean) {
    await loginUser(username, password, remember)
    revalidateSession()
  }

  async function logout() {
    await logoutUser()
    revalidateSession()
  }

  const isLoading = isLoadingSession

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: user !== undefined,
        user,
        login,
        logout,
        revalidateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
