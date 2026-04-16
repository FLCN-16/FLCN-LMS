import { User } from "@flcn-lms/types/auth";
import { CourseEnrollment } from "@flcn-lms/types/test-series";
/**
 * Get user profile
 * GET /api/v1/user/profile
 */
export declare function getProfile(): Promise<User>;
/**
 * Update user profile
 * PATCH /api/v1/user/profile
 */
export declare function updateProfile(data: Partial<{
    name: string;
    phone: string;
    avatarUrl: string;
}>): Promise<User>;
/**
 * Get user statistics
 * GET /api/v1/user/stats
 */
export declare function getUserStats(): Promise<{
    totalCourses: number;
    completedCourses: number;
    enrolledCourses: number;
    totalTestsAttempted: number;
    averageScore: number;
}>;
/**
 * Get user's enrolled courses
 * GET /api/v1/user/enrollments
 */
export declare function getEnrolledCourses(page?: number, limit?: number): Promise<{
    data: (CourseEnrollment & {
        course: any;
    })[];
    total: number;
    page: number;
    limit: number;
}>;
/**
 * Get user settings
 * GET /api/v1/user/settings
 */
export declare function getUserSettings(): Promise<{
    emailNotifications: boolean;
    smsNotifications: boolean;
    theme: "light" | "dark" | "auto";
    language: string;
}>;
/**
 * Update user settings
 * PATCH /api/v1/user/settings
 */
export declare function updateSettings(data: Partial<{
    emailNotifications: boolean;
    smsNotifications: boolean;
    theme: "light" | "dark" | "auto";
    language: string;
}>): Promise<{
    emailNotifications: boolean;
    smsNotifications: boolean;
    theme: "light" | "dark" | "auto";
    language: string;
}>;
//# sourceMappingURL=user.d.ts.map