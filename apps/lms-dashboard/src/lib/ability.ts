import { AbilityBuilder, createMongoAbility } from "@casl/ability"

import type {
  AppAction,
  AppSubject,
  PermissionDescriptor,
  User,
} from "@flcn-lms/types/auth"
import { normalizePermissions } from "@flcn-lms/types/auth"

import type { MongoAbility } from "@casl/ability"

export type AppAbility = MongoAbility<[AppAction, AppSubject]>

export function createAppAbility(user?: User | null) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (!user) {
    return build()
  }

  const permissions = normalizePermissions(user.role, user.permissions)

  permissions.forEach((permission) => {
    const [action, subject] = permission.split(":") as [AppAction, AppSubject]
    can(action, subject)
  })

  return build()
}

export function canAccess(
  ability: AppAbility,
  permission?: PermissionDescriptor
) {
  if (!permission) {
    return true
  }

  return ability.can(permission.action, permission.subject)
}
