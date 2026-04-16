import type { TestAttempt, TestResult } from "@flcn-lms/types/attempts";
import type { LeaderboardEntry } from "@flcn-lms/types/leaderboard";
export type { TestAttempt, AttemptSection, QuestionResponse, TestResult, StartAttemptPayload, SaveResponsePayload, AttemptStatus, ResponseStatus, SectionBreakdownEntry, TopicBreakdownEntry, } from "@flcn-lms/types/attempts";
export type { LeaderboardEntry } from "@flcn-lms/types/leaderboard";
export declare const attempts: import("react-query-kit").CreateRouter<{
    list: import("react-query-kit").RouterQuery<TestAttempt[], {
        testId?: string;
    } | undefined, any>;
    result: import("react-query-kit").RouterQuery<TestResult, {
        attemptId: string;
    }, any>;
    disqualify: import("react-query-kit").RouterMutation<any, {
        attemptId: string;
    }, any, any>;
    leaderboard: {
        topN: import("react-query-kit").RouterQuery<LeaderboardEntry[], {
            testId: string;
            limit?: number;
        }, any>;
        recompute: import("react-query-kit").RouterMutation<any, {
            testId: string;
        }, any, any>;
    };
}>;
export declare const useAttempts: import("react-query-kit").QueryHook<TestAttempt[], {
    testId?: string;
} | undefined, Error>;
export declare const useAttemptResult: import("react-query-kit").QueryHook<TestResult, {
    attemptId: string;
}, Error>;
export declare const useDisqualifyAttempt: import("react-query-kit").MutationHook<any, {
    attemptId: string;
}, Error, any>;
export declare const useLeaderboardTopN: import("react-query-kit").QueryHook<LeaderboardEntry[], {
    testId: string;
    limit?: number;
}, Error>;
export declare const useRecomputeLeaderboard: import("react-query-kit").MutationHook<any, {
    testId: string;
}, Error, any>;
//# sourceMappingURL=index.d.ts.map