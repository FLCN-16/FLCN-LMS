import type { CreateCategoryPayload, CreateCoursePayload, LiveSessionStatus, UpdateCategoryPayload, UpdateCoursePayload } from "@flcn-lms/types/courses";
import type { CourseLesson, CourseMetadata, CourseModule } from "@flcn-lms/types/test-series";
export interface CourseCategory {
    id: string;
    tenantId: string;
    slug: string;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string[] | null;
    seoImageUrl?: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface Course extends CourseMetadata {
    category?: CourseCategory;
    modules?: CourseModuleWithLessons[];
}
export interface CourseModuleWithLessons extends CourseModule {
    lessons?: CourseLesson[];
}
export interface LiveSession {
    id: string;
    tenantId: string;
    courseId: string;
    instructorId: string;
    title: string;
    scheduledAt: string;
    startedAt?: string;
    endedAt?: string;
    recordingUrl?: string | null;
    livekitRoomId?: string | null;
    hlsUrl?: string | null;
    status: LiveSessionStatus;
    maxParticipants?: number | null;
}
export type CreateCourseInput = Omit<CreateCoursePayload, "instructorId">;
export type UpdateCourseInput = Omit<UpdateCoursePayload, "instructorId">;
export declare const courses: import("react-query-kit").CreateRouter<{
    categories: {
        list: import("react-query-kit").RouterQuery<CourseCategory[], any, any>;
        byId: import("react-query-kit").RouterQuery<CourseCategory, {
            id: string;
        }, any>;
        add: import("react-query-kit").RouterMutation<CourseCategory, CreateCategoryPayload, any, any>;
        update: import("react-query-kit").RouterMutation<CourseCategory, {
            id: string;
            data: UpdateCategoryPayload;
        }, any, any>;
        remove: import("react-query-kit").RouterMutation<void, {
            id: string;
        }, any, any>;
    };
    list: import("react-query-kit").RouterQuery<Course[], any, any>;
    byId: import("react-query-kit").RouterQuery<Course, {
        id: string;
    }, any>;
    add: import("react-query-kit").RouterMutation<Course, CreateCourseInput, any, any>;
    update: import("react-query-kit").RouterMutation<Course, {
        id: string;
        data: UpdateCourseInput;
    }, any, any>;
    publish: import("react-query-kit").RouterMutation<Course, {
        id: string;
    }, any, any>;
    remove: import("react-query-kit").RouterMutation<void, {
        id: string;
    }, any, any>;
    liveSessions: {
        list: import("react-query-kit").RouterQuery<LiveSession[], {
            courseId: string;
        }, any>;
    };
}>;
export declare const useCourseCategoriesList: import("react-query-kit").QueryHook<CourseCategory[], void, Error>;
export declare const useCourseCategoryDetail: import("react-query-kit").QueryHook<CourseCategory, {
    id: string;
}, Error>;
export declare const useCreateCourseCategory: import("react-query-kit").MutationHook<CourseCategory, CreateCategoryPayload, Error, any>;
export declare const useUpdateCourseCategory: import("react-query-kit").MutationHook<CourseCategory, {
    id: string;
    data: UpdateCategoryPayload;
}, Error, any>;
export declare const useDeleteCourseCategory: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
export declare const useCoursesList: import("react-query-kit").QueryHook<Course[], void, Error>;
export declare const useCourseDetail: import("react-query-kit").QueryHook<Course, {
    id: string;
}, Error>;
export declare const useCreateCourse: import("react-query-kit").MutationHook<Course, CreateCourseInput, Error, any>;
export declare const useUpdateCourse: import("react-query-kit").MutationHook<Course, {
    id: string;
    data: UpdateCourseInput;
}, Error, any>;
export declare const usePublishCourse: import("react-query-kit").MutationHook<Course, {
    id: string;
}, Error, any>;
export declare const useDeleteCourse: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
export declare const useCourseLiveSessions: import("react-query-kit").QueryHook<LiveSession[], {
    courseId: string;
}, Error>;
export type { CreateCategoryPayload, UpdateCategoryPayload, LiveSessionStatus };
//# sourceMappingURL=index.d.ts.map