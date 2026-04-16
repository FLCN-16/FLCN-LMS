"use client"

import { User } from "@flcn-lms/types/auth"
import { createContext, useContext, useEffect, useState } from "react"

import { getSession } from "@/fetchers/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isError: boolean
  logout: () => void
  revalidate: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchSession = async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const sessionData = await getSession()
      setUser(sessionData)
    } catch (error) {
      console.error("Failed to fetch session:", error)
      setIsError(true)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const logout = () => {
    setUser(null)
    // Clear session cookie and redirect
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/auth/login"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        logout,
        revalidate: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
