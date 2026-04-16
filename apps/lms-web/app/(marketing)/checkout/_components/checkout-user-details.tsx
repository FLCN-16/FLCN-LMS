"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@flcn-lms/ui/components/card"
import { Text } from "@flcn-lms/ui/components/typography"

import { getProfile } from "@/fetchers/user"
import type { User as UserType } from "@flcn-lms/types/auth"

function CheckoutUserDetails() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getProfile()
        setUser(userData)
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  if (isLoading) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>
            <h3>Delivery Details</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>
            <h3>Delivery Details</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-sm text-muted-foreground">
            Please log in to continue with checkout
          </Text>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h3>Delivery Details</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <Text className="text-xs text-muted-foreground">Full Name</Text>
              <Text className="font-semibold">{user.name}</Text>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <Text className="text-xs text-muted-foreground">Email</Text>
              <Text className="truncate font-semibold">{user.email}</Text>
            </div>
          </div>

          {/* Phone */}
          {user.phone ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <Text className="text-xs text-muted-foreground">Phone</Text>
                <Text className="font-semibold">{user.phone}</Text>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckoutUserDetails
