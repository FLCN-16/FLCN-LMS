import type { User } from "@flcn-lms/types/auth";
export interface LoginVariables {
    email: string;
    password: string;
    remember: boolean;
}
export interface LoginResponse {
    user: User;
    token: string;
}
declare const useLoginUser: import("react-query-kit").MutationHook<LoginResponse, LoginVariables, Error, unknown>;
export default useLoginUser;
//# sourceMappingURL=login.d.ts.map