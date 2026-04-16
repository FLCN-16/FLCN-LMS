import type { AppAction, AppSubject, PermissionDescriptor } from "@flcn-lms/types/auth";
declare function useAuth(permission?: PermissionDescriptor): {
    isAuthorized: any;
    can: (action: AppAction, subject: AppSubject) => any;
};
export default useAuth;
//# sourceMappingURL=use-auth.hook.d.ts.map