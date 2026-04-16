import type { CreateQuestionPayload, Question } from "@flcn-lms/types/questions";
export type { Question, QuestionOption, CreateQuestionPayload, QuestionType, Difficulty, } from "@flcn-lms/types/questions";
export declare const questions: import("react-query-kit").CreateRouter<{
    list: import("react-query-kit").RouterQuery<Question[], {
        params?: Record<string, string>;
    } | undefined, any>;
    byId: import("react-query-kit").RouterQuery<Question, {
        id: string;
    }, any>;
    add: import("react-query-kit").RouterMutation<Question, CreateQuestionPayload, any, any>;
    update: import("react-query-kit").RouterMutation<Question, {
        id: string;
        data: CreateQuestionPayload;
    }, any, any>;
    approve: import("react-query-kit").RouterMutation<Question, {
        id: string;
    }, any, any>;
    remove: import("react-query-kit").RouterMutation<void, {
        id: string;
    }, any, any>;
}>;
export declare const useQuestionsList: import("react-query-kit").QueryHook<Question[], {
    params?: Record<string, string>;
} | undefined, Error>;
export declare const useQuestionDetail: import("react-query-kit").QueryHook<Question, {
    id: string;
}, Error>;
export declare const useCreateQuestion: import("react-query-kit").MutationHook<Question, CreateQuestionPayload, Error, any>;
export declare const useUpdateQuestion: import("react-query-kit").MutationHook<Question, {
    id: string;
    data: CreateQuestionPayload;
}, Error, any>;
export declare const useApproveQuestion: import("react-query-kit").MutationHook<Question, {
    id: string;
}, Error, any>;
export declare const useDeleteQuestion: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
//# sourceMappingURL=index.d.ts.map