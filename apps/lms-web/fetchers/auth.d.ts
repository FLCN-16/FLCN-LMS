import { User } from "@flcn-lms/types/auth";
/**
 * User login
 * POST /api/v1/auth/login
 */
export declare function login(data: {
    email: string;
    password: string;
}): Promise<{
    accessToken: string;
    user: User;
}>;
/**
 * User registration
 * POST /api/v1/auth/register
 */
export declare function register(data: {
    email: string;
    password: string;
    name: string;
}): Promise<{
    accessToken: string;
    user: User;
}>;
/**
 * Get current user session
 * GET /api/v1/auth/session
 */
export declare function getSession(): Promise<User>;
/**
 * Change user password
 * POST /api/v1/auth/change-password
 */
export declare function changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=auth.d.ts.map