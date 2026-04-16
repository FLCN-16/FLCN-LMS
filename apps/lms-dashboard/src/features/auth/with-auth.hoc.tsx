import React from "react"

import { Navigate } from "react-router-dom"

import type { PermissionDescriptor } from "@flcn-lms/types/auth"

import { AppLoader } from "@/components/loader"
import { AUTH_DISABLED } from "@/constants/auth"
import useAuth from "@/features/auth/use-auth.hook"

function withAuth(
  Component: React.ComponentType,
  permission?: PermissionDescriptor
) {
  return function AuthenticatedComponent() {
    const { isLoading, isAuthenticated, can } = useAuth()

    if (AUTH_DISABLED) {
      return <Component />
    }

    if (isLoading) return <AppLoader />

    if (!isAuthenticated) return <Navigate to="/auth/login" replace />

    if (permission && !can(permission.action, permission.subject)) {
      return <Navigate to="/panel" replace />
    }

    return <Component />
  }
}

export default withAuth
