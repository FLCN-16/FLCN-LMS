export const appActions = [
    "manage",
    "read",
    "create",
    "update",
    "delete",
    "publish",
    "approve",
    "enroll",
];
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
];
export const tenantScopedSubjects = [
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
];
const defaultPermissionsByRole = {
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
};
function isPermissionToken(value) {
    return value.includes(":");
}
function isPermissionAllowedForRole(role, permission) {
    const [action, subject] = permission.split(":");
    return defaultPermissionsByRole[role].some((grantedPermission) => {
        const [grantedAction, grantedSubject] = grantedPermission.split(":");
        if (grantedSubject === "all") {
            return true;
        }
        if (grantedSubject !== subject) {
            return false;
        }
        return grantedAction === "manage" || grantedAction === action;
    });
}
export function getDefaultPermissionsForRole(role) {
    return [...defaultPermissionsByRole[role]];
}
export function normalizePermissions(role, permissions) {
    if (!permissions || permissions.length === 0) {
        return getDefaultPermissionsForRole(role);
    }
    return permissions
        .filter(isPermissionToken)
        .filter((permission) => isPermissionAllowedForRole(role, permission));
}
export function isTenantScopedSubject(subject) {
    return tenantScopedSubjects.includes(subject);
}
