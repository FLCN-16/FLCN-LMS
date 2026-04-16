import { type MongoAbility } from '@casl/ability';
import { type ExecutionContext } from '@nestjs/common';
import type { AppAction, AppSubject, PermissionDescriptor, Role } from '@flcn-lms/types/auth';
import type { AuthenticatedUser, JwtPayload } from '../auth/jwt.strategy';
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;
export interface AbilityUser {
    id: string;
    role: Role;
    instituteId?: string;
    permissions?: string[];
}
export declare function createAppAbility(user: AbilityUser): AppAbility;
export declare class CaslAbilityFactory {
    createForUser(user: AbilityUser): AppAbility;
    ensureRequestAccess(context: ExecutionContext, user: AbilityUser, permission: PermissionDescriptor): void;
}
export declare function toAbilityUser(payload: JwtPayload | AuthenticatedUser): AbilityUser;
//# sourceMappingURL=casl-ability.factory.d.ts.map