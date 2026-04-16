"use client"

import { useState } from "react"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import { Separator } from "@flcn-lms/ui/components/separator"

import { useAuth } from "@/context/auth-context"
import { updateProfile } from "@/fetchers/user"

function UserProfilePage() {
  const { user, revalidate } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  })

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setError("")
      setIsSaving(true)
      await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
      })
      await revalidate()
      setIsEditing(false)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    })
    setIsEditing(false)
    setError("")
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <Separator />

      {/* Profile Info Section */}
      <div className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Profile Picture</h2>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-semibold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <Button variant="outline" disabled>
              Upload Picture
            </Button>
          </div>
        </div>

        <Separator />

        {/* Account Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Account Details</h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <FieldGroup>
            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </Field>

            {/* Email (read-only) */}
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                placeholder="Your email address"
              />
              <FieldDescription>
                Email address cannot be changed. Contact support to change it.
              </FieldDescription>
            </Field>

            {/* Phone */}
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your phone number"
                type="tel"
              />
            </Field>

            {/* Role (read-only) */}
            <Field>
              <FieldLabel htmlFor="role">Account Type</FieldLabel>
              <Input
                id="role"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                disabled
              />
              <FieldDescription>
                Your role defines what actions you can perform.
              </FieldDescription>
            </Field>

            {/* Member Since (read-only) */}
            <Field>
              <FieldLabel htmlFor="joined">Member Since</FieldLabel>
              <Input
                id="joined"
                value={new Date(user.createdAt).toLocaleDateString()}
                disabled
              />
            </Field>
          </FieldGroup>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Password Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Security</h2>
          <Button variant="outline" asChild>
            <a href="/user/settings">Change Password</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
