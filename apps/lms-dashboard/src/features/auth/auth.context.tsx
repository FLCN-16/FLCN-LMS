import Cookies from "js-cookie"
import React from "react"

import type { User } from "@flcn-lms/types/auth"
import { normalizePermissions } from "@flcn-lms/types/auth"

import { AUTH_COOKIE_NAME, AUTH_DISABLED } from "@/constants/auth"
import { createAppAbility, type AppAbility } from "@/lib/ability"
import useLoginUser from "@/queries/auth/login"
import useLogoutUser from "@/queries/auth/logout"
import useSession from "@/queries/auth/session"

interface AuthContextProps {
  isLoading: boolean
  isAuthenticated: boolean
  user: User | undefined
  ability: AppAbility
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => Promise<void>
  revalidateSession: () => void
}

/* eslint-disable-next-line react-refresh/only-export-components */
export const AuthContext = React.createContext<AuthContextProps | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

const mockUser: User = {
  id: "dashboard-dev-user",
  name: "Dashboard Admin",
  email: "admin@example.com",
  phone: null,
  avatarUrl: null,
  role: "super_admin",
  permissions: normalizePermissions("super_admin"),
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function AuthProvider({ children }: AuthProviderProps) {
  const hasToken = Boolean(Cookies.get(AUTH_COOKIE_NAME))

  const {
    data: sessionUser,
    isLoading: isLoadingSession,
    refetch: revalidateSession,
  } = useSession({
    enabled: hasToken,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: hasToken ? 1000 * 60 * 5 : false,
  })

  const loginMutation = useLoginUser()
  const logoutMutation = useLogoutUser()

  async function login(email: string, password: string, remember: boolean) {
    if (AUTH_DISABLED) {
      void email
      void password
      void remember
      return
    }

    await loginMutation.mutateAsync({ email, password, remember })
    await revalidateSession()
  }

  async function logout() {
    if (AUTH_DISABLED) {
      Cookies.remove(AUTH_COOKIE_NAME)
      return
    }

    await logoutMutation.mutateAsync()
    await revalidateSession()
  }

  const user = React.useMemo(() => {
    if (AUTH_DISABLED) {
      return mockUser
    }

    if (!sessionUser) {
      return undefined
    }

    return {
      ...sessionUser,
      permissions: normalizePermissions(
        sessionUser.role,
        sessionUser.permissions
      ),
    }
  }, [sessionUser])
  const ability = React.useMemo(() => createAppAbility(user), [user])

  if (AUTH_DISABLED) {
    return (
      <AuthContext.Provider
        value={{
          isLoading: false,
          isAuthenticated: true,
          user: mockUser,
          ability,
          login,
          logout,
          revalidateSession: () => undefined,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  const isLoading =
    hasToken &&
    (isLoadingSession || loginMutation.isPending || logoutMutation.isPending)

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: Boolean(hasToken && user),
        user: hasToken ? user : undefined,
        ability,
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
