export declare const appActions: readonly ["manage", "read", "create", "update", "delete", "publish", "approve", "enroll"];
export type AppAction = (typeof appActions)[number];
export declare const appSubjects: readonly ["all", "Dashboard", "Question", "ExamType", "TestSeries", "Test", "Attempt", "Leaderboard", "Dpp", "Course", "CourseCategory", "LiveClass", "ContentReview", "Transaction", "Coupon", "Refund", "Analytics", "Announcement", "Notification", "Student", "Faculty", "Batch", "RolePermission", "Tenant", "Institute", "PlanPricing", "Billing", "AuditLog", "Setting", "Branding", "Integration"];
export type AppSubject = (typeof appSubjects)[number];
export type PermissionToken = `${AppAction}:${AppSubject}`;
export type Role = "super_admin" | "admin" | "instructor" | "student";
export type UserPermissions = PermissionToken[];
export interface PermissionDescriptor {
    action: AppAction;
    subject: AppSubject;
}
export interface User {
    id: string;
    instituteId?: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
    role: Role;
    permissions: UserPermissions;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare const tenantScopedSubjects: AppSubject[];
export declare function getDefaultPermissionsForRole(role: Role): UserPermissions;
export declare function normalizePermissions(role: Role, permissions?: string[] | null): UserPermissions;
export declare function isTenantScopedSubject(subject: AppSubject): boolean;
//# sourceMappingURL=auth.d.ts.map