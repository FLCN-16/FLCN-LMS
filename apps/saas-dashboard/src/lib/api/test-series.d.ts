import type { CreateTestPayload, CreateTestSeriesPayload } from "@flcn-lms/types/test-series";
export type { TestSeries, Test, TestSection, TestSeriesEnrollment, CreateTestSeriesPayload, CreateTestPayload, CreateTestSectionPayload, TestType, ResultMode, } from "@flcn-lms/types/test-series";
export declare const testSeriesApi: {
    list: () => any;
    get: (id: string) => any;
    create: (data: CreateTestSeriesPayload) => any;
    update: (id: string, data: CreateTestSeriesPayload) => any;
    publish: (id: string) => any;
    remove: (id: string) => any;
    listTests: (seriesId: string) => any;
    getTest: (seriesId: string, testId: string) => any;
    createTest: (seriesId: string, data: CreateTestPayload) => any;
    updateTest: (seriesId: string, testId: string, data: CreateTestPayload) => any;
    publishTest: (seriesId: string, testId: string) => any;
};
//# sourceMappingURL=test-series.d.ts.map