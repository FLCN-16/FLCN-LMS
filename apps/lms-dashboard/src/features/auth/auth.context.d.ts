import React from "react";
import type { User } from "@flcn-lms/types/auth";
import { type AppAbility } from "@/lib/ability";
interface AuthContextProps {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User | undefined;
    ability: AppAbility;
    login: (email: string, password: string, remember: boolean) => Promise<void>;
    logout: () => Promise<void>;
    revalidateSession: () => void;
}
export declare const AuthContext: React.Context<AuthContextProps | null>;
interface AuthProviderProps {
    children: React.ReactNode;
}
declare function AuthProvider({ children }: AuthProviderProps): React.JSX.Element;
export default AuthProvider;
//# sourceMappingURL=auth.context.d.ts.map