export enum Role {
  Tenant = "tenant",
  Admin = "admin",
  User = "user",
}

export type UserPermissions = Array<string>

export interface User {
  id: string
  name: string
  email: string
  role: Role
  permissions: UserPermissions
}
