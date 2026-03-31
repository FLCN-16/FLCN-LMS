import React from "react"

import { Navigate } from "react-router-dom"

import useAuth from "@/hooks/use-auth"
import { AppLoader } from "@/components/loader"

function withAuth(
  Component: React.FC,
  permissions: string[] = [],
  anyPermission: boolean = false
) {
  return function AuthenticatedComponent() {
    const { isLoading, isAuthenticated } = useAuth(permissions, anyPermission)

    if (isLoading) return <AppLoader />

    if (!isAuthenticated) return <Navigate to="/auth/login" />

    return <Component />
  }
}

export default withAuth
