export type { TestAttempt, AttemptSection, QuestionResponse, TestResult, StartAttemptPayload, SaveResponsePayload, AttemptStatus, ResponseStatus, SectionBreakdownEntry, TopicBreakdownEntry, } from "@flcn-lms/types/attempts";
export type { LeaderboardEntry } from "@flcn-lms/types/leaderboard";
export declare const attemptsApi: {
    list: (testId?: string) => any;
    getResult: (attemptId: string) => any;
    disqualify: (attemptId: string) => any;
};
export declare const leaderboardApi: {
    getTopN: (testId: string, limit?: number) => any;
    recompute: (testId: string) => any;
};
//# sourceMappingURL=attempts.d.ts.map