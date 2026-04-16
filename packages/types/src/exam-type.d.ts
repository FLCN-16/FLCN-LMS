export interface ExamType {
    id: string;
    instituteId?: string;
    slug: string;
    label: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
}
export interface CreateExamTypePayload {
    slug: string;
    label: string;
    description?: string;
    order?: number;
}
export interface UpdateExamTypePayload {
    label?: string;
    description?: string;
    order?: number;
    isActive?: boolean;
}
//# sourceMappingURL=exam-type.d.ts.map