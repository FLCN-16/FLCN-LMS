import React from "react"

import { AuthContext } from "@/contexts/auth"

function useAuth(permissions: string[], anyPermission: boolean = false) {
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  const auth = React.useContext(AuthContext)
  if (!auth) throw new Error("useAuth must be used within an AuthContext")

  React.useEffect(() => {
    if (auth.user?.permissions) {
      const userPermissions = auth.user.permissions
      const hasPermission = anyPermission
        ? permissions.some((permission) => userPermissions.includes(permission))
        : permissions.every((permission) =>
            userPermissions.includes(permission)
          )
      setIsAuthorized(hasPermission)
    } else {
      setIsAuthorized(false)
    }
  }, [auth.user, permissions, anyPermission])

  return { ...auth, isAuthorized }
}

export default useAuth
