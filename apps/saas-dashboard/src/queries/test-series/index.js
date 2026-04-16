import { router } from "react-query-kit";
import fetch from "@/lib/fetch";
export const testSeries = router("testSeries", {
    list: router.query({
        fetcher: async () => {
            const response = await fetch.get("/api/test-series");
            return response.data;
        },
    }),
    byId: router.query({
        fetcher: async (variables) => {
            const response = await fetch.get(`/api/test-series/${variables.id}`);
            return response.data;
        },
    }),
    add: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.post("/api/test-series", variables);
            return response.data;
        },
    }),
    update: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/test-series/${variables.id}`, variables.data);
            return response.data;
        },
    }),
    publish: router.mutation({
        mutationFn: async (variables) => {
            const response = await fetch.patch(`/api/test-series/${variables.id}/publish`);
            return response.data;
        },
    }),
    remove: router.mutation({
        mutationFn: async (variables) => {
            await fetch.delete(`/api/test-series/${variables.id}`);
        },
    }),
    tests: {
        list: router.query({
            fetcher: async (variables) => {
                const response = await fetch.get(`/api/test-series/${variables.seriesId}/tests`);
                return response.data;
            },
        }),
        byId: router.query({
            fetcher: async (variables) => {
                const response = await fetch.get(`/api/test-series/${variables.seriesId}/tests/${variables.testId}`);
                return response.data;
            },
        }),
        add: router.mutation({
            mutationFn: async (variables) => {
                const response = await fetch.post(`/api/test-series/${variables.seriesId}/tests`, variables.data);
                return response.data;
            },
        }),
        update: router.mutation({
            mutationFn: async (variables) => {
                const response = await fetch.patch(`/api/test-series/${variables.seriesId}/tests/${variables.testId}`, variables.data);
                return response.data;
            },
        }),
        publish: router.mutation({
            mutationFn: async (variables) => {
                const response = await fetch.patch(`/api/test-series/${variables.seriesId}/tests/${variables.testId}/publish`);
                return response.data;
            },
        }),
    },
});
export const useTestSeriesList = testSeries.list.useQuery;
export const useTestSeriesDetail = testSeries.byId.useQuery;
export const useCreateTestSeries = testSeries.add.useMutation;
export const useUpdateTestSeries = testSeries.update.useMutation;
export const usePublishTestSeries = testSeries.publish.useMutation;
export const useRemoveTestSeries = testSeries.remove.useMutation;
export const useTestsListQuery = testSeries.tests.list;
export const useTestsList = useTestsListQuery.useQuery;
export const useTestDetail = testSeries.tests.byId.useQuery;
export const useCreateTest = testSeries.tests.add.useMutation;
export const useUpdateTest = testSeries.tests.update.useMutation;
export const usePublishTest = testSeries.tests.publish.useMutation;
