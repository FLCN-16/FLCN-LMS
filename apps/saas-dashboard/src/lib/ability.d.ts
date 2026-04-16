import type { AppAction, AppSubject, PermissionDescriptor, User } from "@flcn-lms/types/auth";
import type { MongoAbility } from "@casl/ability";
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;
export declare function createAppAbility(user?: User | null): AppAbility;
export declare function canAccess(ability: AppAbility, permission?: PermissionDescriptor): boolean;
//# sourceMappingURL=ability.d.ts.map