import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const analytics = router("analytics", {
    overview: router.query({
        fetcher: async () => {
            const response = await fetch.get("/api/v1/analytics/overview");
            return response.data;
        },
    }),
    courseStats: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/v1/analytics/courses/${variables.id}`);
            return response.data;
        },
    }),
    testStats: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/v1/analytics/tests/${variables.id}`);
            return response.data;
        },
    }),
});
export const useAnalyticsOverview = analytics.overview.useQuery;
export const useCourseAnalytics = analytics.courseStats.useQuery;
export const useTestAnalytics = analytics.testStats.useQuery;
