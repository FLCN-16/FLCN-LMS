export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "TIMED_OUT" | "PAUSED";
export type ResponseStatus = "UNATTEMPTED" | "ATTEMPTED" | "MARKED_REVIEW" | "ATTEMPTED_MARKED";
export interface TestAttempt {
    id: string;
    testId: string;
    userId: string;
    attemptNumber: number;
    status: AttemptStatus;
    startedAt: string;
    submittedAt?: string;
    remainingTimeSecs?: number;
    ipAddress?: string;
    userAgent?: string;
    tabSwitchCount: number;
    isDisqualified: boolean;
}
export interface AttemptSection {
    id: string;
    attemptId: string;
    testSectionId: string;
    startedAt?: string;
    submittedAt?: string;
    remainingTimeSecs?: number;
}
export interface QuestionResponse {
    id: string;
    attemptSectionId: string;
    questionId: string;
    selectedOptionIds?: string[];
    integerAnswer?: number;
    subjectiveAnswer?: string;
    status: ResponseStatus;
    timeTakenSecs: number;
    isCorrect?: boolean;
    marksAwarded?: number;
}
export interface SectionBreakdownEntry {
    marks: number;
    correct: number;
    timeSecs: number;
}
export interface TopicBreakdownEntry {
    correct: number;
    wrong: number;
    skipped?: number;
}
export interface TestResult {
    id: string;
    attemptId: string;
    testId: string;
    userId: string;
    totalMarks: number;
    marksObtained: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    percentile?: number;
    rank?: number;
    accuracy: number;
    timeTakenSecs: number;
    sectionBreakdown: Record<string, SectionBreakdownEntry>;
    topicBreakdown: Record<string, TopicBreakdownEntry>;
    computedAt: string;
}
export interface StartAttemptPayload {
    ipAddress?: string;
    userAgent?: string;
}
export interface SaveResponsePayload {
    questionId: string;
    attemptSectionId: string;
    selectedOptionIds?: string[];
    integerAnswer?: number;
    subjectiveAnswer?: string;
    status: ResponseStatus;
    timeTakenSecs?: number;
}
//# sourceMappingURL=attempts.d.ts.map