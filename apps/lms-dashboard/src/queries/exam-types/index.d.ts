import type { CreateExamTypePayload, ExamType, UpdateExamTypePayload } from "@flcn-lms/types/exam-type";
export type { ExamType, CreateExamTypePayload, UpdateExamTypePayload, } from "@flcn-lms/types/exam-type";
export declare const examTypes: import("react-query-kit").CreateRouter<{
    list: import("react-query-kit").RouterQuery<ExamType[], {
        includeInactive?: boolean;
    } | undefined, any>;
    byId: import("react-query-kit").RouterQuery<ExamType, {
        id: string;
    }, any>;
    add: import("react-query-kit").RouterMutation<ExamType, CreateExamTypePayload, any, any>;
    update: import("react-query-kit").RouterMutation<ExamType, {
        id: string;
        data: UpdateExamTypePayload;
    }, any, any>;
    remove: import("react-query-kit").RouterMutation<void, {
        id: string;
    }, any, any>;
    seed: import("react-query-kit").RouterMutation<ExamType[], any, any, any>;
}>;
export declare const useExamTypesList: import("react-query-kit").QueryHook<ExamType[], {
    includeInactive?: boolean;
} | undefined, Error>;
export declare const useExamTypeDetail: import("react-query-kit").QueryHook<ExamType, {
    id: string;
}, Error>;
export declare const useCreateExamType: import("react-query-kit").MutationHook<ExamType, CreateExamTypePayload, Error, any>;
export declare const useUpdateExamType: import("react-query-kit").MutationHook<ExamType, {
    id: string;
    data: UpdateExamTypePayload;
}, Error, any>;
export declare const useDeleteExamType: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
export declare const useSeedExamTypes: import("react-query-kit").MutationHook<ExamType[], void, Error, any>;
//# sourceMappingURL=index.d.ts.map