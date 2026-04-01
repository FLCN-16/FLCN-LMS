import React from "react"

import type {
  AppAction,
  AppSubject,
  PermissionDescriptor,
} from "@flcn-lms/types/auth"

import { AuthContext } from "@/features/auth/auth.context"

function useAuth(permission?: PermissionDescriptor) {
  const auth = React.useContext(AuthContext)

  if (!auth) {
    throw new Error("useAuth must be used within an AuthContext")
  }

  const can = React.useCallback(
    (action: AppAction, subject: AppSubject) =>
      auth.ability.can(action, subject),
    [auth.ability]
  )

  const isAuthorized = React.useMemo(() => {
    if (!auth.isAuthenticated) {
      return false
    }

    if (!permission) {
      return true
    }

    return can(permission.action, permission.subject)
  }, [auth.isAuthenticated, can, permission])

  return { ...auth, isAuthorized, can }
}

export default useAuth
