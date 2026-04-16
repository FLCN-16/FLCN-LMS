import type { CreateExamTypePayload, UpdateExamTypePayload } from "@flcn-lms/types/exam-type";
export type { ExamType, CreateExamTypePayload, UpdateExamTypePayload, } from "@flcn-lms/types/exam-type";
export declare const examTypesApi: {
    list: (includeInactive?: boolean) => any;
    create: (data: CreateExamTypePayload) => any;
    update: (id: string, data: UpdateExamTypePayload) => any;
    remove: (id: string) => any;
    seed: () => any;
};
//# sourceMappingURL=exam-types.d.ts.map