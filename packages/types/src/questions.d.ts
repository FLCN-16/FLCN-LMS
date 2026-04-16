export type QuestionType = "MCQ" | "MSQ" | "INTEGER" | "SUBJECTIVE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export interface QuestionOption {
    id: string;
    questionId?: string;
    content: string;
    isCorrect: boolean;
    order: number;
    imageUrl?: string;
}
export interface Question {
    id: string;
    instituteId?: string;
    type: QuestionType;
    subject: string;
    topic: string;
    subtopic?: string;
    difficulty: Difficulty;
    content: string;
    explanation?: string;
    imageUrl?: string;
    positiveMarks: number;
    negativeMarks: number;
    correctInteger?: number;
    createdBy?: string;
    isApproved: boolean;
    createdAt: string;
    options: QuestionOption[];
}
export interface CreateQuestionPayload {
    type: QuestionType;
    subject: string;
    topic: string;
    subtopic?: string;
    difficulty: Difficulty;
    content: string;
    explanation?: string;
    imageUrl?: string;
    positiveMarks?: number;
    negativeMarks?: number;
    correctInteger?: number;
    options: Omit<QuestionOption, "id" | "questionId">[];
}
export interface UpdateQuestionPayload extends Partial<CreateQuestionPayload> {
}
export interface QuestionBankFilters {
    subject?: string;
    topic?: string;
    difficulty?: Difficulty;
    type?: QuestionType;
    isApproved?: boolean;
}
//# sourceMappingURL=questions.d.ts.map