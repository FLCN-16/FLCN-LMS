import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { normalizePermissions } from "@flcn-lms/types/auth";
export function createAppAbility(user) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    if (!user) {
        return build();
    }
    const permissions = normalizePermissions(user.role, user.permissions);
    permissions.forEach((permission) => {
        const [action, subject] = permission.split(":");
        can(action, subject);
    });
    return build();
}
export function canAccess(ability, permission) {
    if (!permission) {
        return true;
    }
    return ability.can(permission.action, permission.subject);
}
