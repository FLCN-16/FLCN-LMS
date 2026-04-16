export const appActions = [
  "manage",
  "read",
  "create",
  "update",
  "delete",
  "publish",
  "approve",
  "enroll",
] as const

export type AppAction = (typeof appActions)[number]

export const appSubjects = [
  "all",
  "Dashboard",
  "Question",
  "ExamType",
  "TestSeries",
  "Test",
  "Attempt",
  "Leaderboard",
  "Dpp",
  "Course",
  "CourseCategory",
  "LiveClass",
  "ContentReview",
  "Transaction",
  "Coupon",
  "Refund",
  "Analytics",
  "Announcement",
  "Notification",
  "Student",
  "Faculty",
  "Batch",
  "RolePermission",
  "Tenant",
  "Institute",
  "PlanPricing",
  "Billing",
  "AuditLog",
  "Setting",
  "Branding",
  "Integration",
] as const

export type AppSubject = (typeof appSubjects)[number]

export type PermissionToken = `${AppAction}:${AppSubject}`

export type Role = "super_admin" | "admin" | "instructor" | "student"

export type UserPermissions = PermissionToken[]

export interface PermissionDescriptor {
  action: AppAction
  subject: AppSubject
}

export interface User {
  id: string
  instituteId?: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: Role
  permissions: UserPermissions
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const tenantScopedSubjects: AppSubject[] = [
  "Question",
  "ExamType",
  "TestSeries",
  "Test",
  "Attempt",
  "Leaderboard",
  "Dpp",
  "Course",
  "CourseCategory",
  "LiveClass",
  "ContentReview",
  "Transaction",
  "Coupon",
  "Refund",
  "Analytics",
  "Announcement",
  "Notification",
  "Student",
  "Faculty",
  "Batch",
  "RolePermission",
  "Setting",
  "Branding",
  "Integration",
]

const defaultPermissionsByRole: Record<Role, UserPermissions> = {
  super_admin: [
    "read:Dashboard",
    "manage:Tenant",
    "manage:Institute",
    "manage:PlanPricing",
    "manage:Billing",
    "read:AuditLog",
  ],
  admin: [
    "read:Dashboard",
    "manage:Question",
    "manage:ExamType",
    "manage:TestSeries",
    "manage:Test",
    "manage:Attempt",
    "read:Leaderboard",
    "manage:Dpp",
    "manage:Course",
    "manage:CourseCategory",
    "manage:LiveClass",
    "manage:ContentReview",
    "manage:Transaction",
    "manage:Coupon",
    "manage:Refund",
    "read:Analytics",
    "manage:Announcement",
    "manage:Notification",
    "manage:Student",
    "manage:Faculty",
    "manage:Batch",
    "manage:RolePermission",
    "manage:Setting",
    "manage:Branding",
    "manage:Integration",
  ],
  instructor: [
    "read:Dashboard",
    "read:Question",
    "create:Question",
    "update:Question",
    "approve:Question",
    "read:ExamType",
    "read:TestSeries",
    "create:TestSeries",
    "update:TestSeries",
    "publish:TestSeries",
    "read:Test",
    "create:Test",
    "update:Test",
    "publish:Test",
    "read:Attempt",
    "read:Leaderboard",
    "read:Dpp",
    "create:Dpp",
    "update:Dpp",
    "read:Course",
    "read:CourseCategory",
    "create:Course",
    "update:Course",
    "publish:Course",
    "read:LiveClass",
    "create:LiveClass",
    "update:LiveClass",
    "read:Analytics",
  ],
  student: [
    "read:Dashboard",
    "read:Course",
    "enroll:Course",
    "read:TestSeries",
    "enroll:TestSeries",
    "read:Test",
    "create:Attempt",
    "update:Attempt",
    "read:Attempt",
    "read:Leaderboard",
    "read:LiveClass",
  ],
}

function isPermissionToken(value: string): value is PermissionToken {
  return value.includes(":")
}

function isPermissionAllowedForRole(
  role: Role,
  permission: PermissionToken
): boolean {
  const [action, subject] = permission.split(":") as [AppAction, AppSubject]

  return defaultPermissionsByRole[role].some((grantedPermission) => {
    const [grantedAction, grantedSubject] = grantedPermission.split(":") as [
      AppAction,
      AppSubject,
    ]

    if (grantedSubject === "all") {
      return true
    }

    if (grantedSubject !== subject) {
      return false
    }

    return grantedAction === "manage" || grantedAction === action
  })
}

export function getDefaultPermissionsForRole(role: Role): UserPermissions {
  return [...defaultPermissionsByRole[role]]
}

export function normalizePermissions(
  role: Role,
  permissions?: string[] | null
): UserPermissions {
  if (!permissions || permissions.length === 0) {
    return getDefaultPermissionsForRole(role)
  }

  return permissions
    .filter(isPermissionToken)
    .filter((permission) => isPermissionAllowedForRole(role, permission))
}

export function isTenantScopedSubject(subject: AppSubject): boolean {
  return tenantScopedSubjects.includes(subject)
}
