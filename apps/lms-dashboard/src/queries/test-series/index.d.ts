import type { CreateTestPayload, CreateTestSeriesPayload, Test, TestSeries } from "@flcn-lms/types/test-series";
export type { TestSeries, Test, TestSection, TestSeriesEnrollment, CreateTestSeriesPayload, CreateTestPayload, CreateTestSectionPayload, TestType, ResultMode, } from "@flcn-lms/types/test-series";
export declare const testSeries: import("react-query-kit").CreateRouter<{
    list: import("react-query-kit").RouterQuery<TestSeries[], any, any>;
    byId: import("react-query-kit").RouterQuery<TestSeries, {
        id: string;
    }, any>;
    add: import("react-query-kit").RouterMutation<TestSeries, CreateTestSeriesPayload, any, any>;
    update: import("react-query-kit").RouterMutation<TestSeries, {
        id: string;
        data: CreateTestSeriesPayload;
    }, any, any>;
    publish: import("react-query-kit").RouterMutation<TestSeries, {
        id: string;
    }, any, any>;
    remove: import("react-query-kit").RouterMutation<void, {
        id: string;
    }, any, any>;
    tests: {
        list: import("react-query-kit").RouterQuery<Test[], {
            seriesId: string;
        }, any>;
        byId: import("react-query-kit").RouterQuery<Test, {
            seriesId: string;
            testId: string;
        }, any>;
        add: import("react-query-kit").RouterMutation<Test, {
            seriesId: string;
            data: CreateTestPayload;
        }, any, any>;
        update: import("react-query-kit").RouterMutation<Test, {
            seriesId: string;
            testId: string;
            data: CreateTestPayload;
        }, any, any>;
        publish: import("react-query-kit").RouterMutation<Test, {
            seriesId: string;
            testId: string;
        }, any, any>;
    };
}>;
export declare const useTestSeriesList: import("react-query-kit").QueryHook<TestSeries[], void, Error>;
export declare const useTestSeriesDetail: import("react-query-kit").QueryHook<TestSeries, {
    id: string;
}, Error>;
export declare const useCreateTestSeries: import("react-query-kit").MutationHook<TestSeries, CreateTestSeriesPayload, Error, any>;
export declare const useUpdateTestSeries: import("react-query-kit").MutationHook<TestSeries, {
    id: string;
    data: CreateTestSeriesPayload;
}, Error, any>;
export declare const usePublishTestSeries: import("react-query-kit").MutationHook<TestSeries, {
    id: string;
}, Error, any>;
export declare const useRemoveTestSeries: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
export declare const useTestsListQuery: import("react-query-kit").ResolvedRouterQuery<Test[], {
    seriesId: string;
}, Error>;
export declare const useTestsList: import("react-query-kit").QueryHook<Test[], {
    seriesId: string;
}, Error>;
export declare const useTestDetail: import("react-query-kit").QueryHook<Test, {
    seriesId: string;
    testId: string;
}, Error>;
export declare const useCreateTest: import("react-query-kit").MutationHook<Test, {
    seriesId: string;
    data: CreateTestPayload;
}, Error, any>;
export declare const useUpdateTest: import("react-query-kit").MutationHook<Test, {
    seriesId: string;
    testId: string;
    data: CreateTestPayload;
}, Error, any>;
export declare const usePublishTest: import("react-query-kit").MutationHook<Test, {
    seriesId: string;
    testId: string;
}, Error, any>;
//# sourceMappingURL=index.d.ts.map