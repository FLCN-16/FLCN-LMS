import type { CreateQuestionPayload } from "@flcn-lms/types/questions";
export type { Question, QuestionOption, CreateQuestionPayload, QuestionType, Difficulty, } from "@flcn-lms/types/questions";
export declare const questionsApi: {
    list: (params?: Record<string, string>) => any;
    get: (id: string) => any;
    create: (data: CreateQuestionPayload) => any;
    update: (id: string, data: CreateQuestionPayload) => any;
    approve: (id: string) => any;
    remove: (id: string) => any;
};
//# sourceMappingURL=questions.d.ts.map