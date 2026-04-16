export interface AnalyticsOverview {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    activeEnrollments: number;
    growthRate: number;
}
export interface CourseAnalytics {
    courseId: string;
    title: string;
    totalSales: number;
    totalRevenue: number;
    avgProgress: number;
    completionRate: number;
}
export interface TestAnalytics {
    testId: string;
    title: string;
    totalAttempts: number;
    avgScore: number;
    passRate: number;
}
export declare const analytics: import("react-query-kit").CreateRouter<{
    overview: import("react-query-kit").RouterQuery<AnalyticsOverview, any, any>;
    courseStats: import("react-query-kit").RouterQuery<CourseAnalytics, {
        id: string;
    }, any>;
    testStats: import("react-query-kit").RouterQuery<TestAnalytics, {
        id: string;
    }, any>;
}>;
export declare const useAnalyticsOverview: import("react-query-kit").QueryHook<AnalyticsOverview, void, Error>;
export declare const useCourseAnalytics: import("react-query-kit").QueryHook<CourseAnalytics, {
    id: string;
}, Error>;
export declare const useTestAnalytics: import("react-query-kit").QueryHook<TestAnalytics, {
    id: string;
}, Error>;
//# sourceMappingURL=index.d.ts.map