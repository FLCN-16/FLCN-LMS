export interface LeaderboardEntry {
    rank: number;
    userId: string;
    userName: string;
    avatarUrl?: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTakenSecs: number;
}
export declare const leaderboard: import("react-query-kit").CreateRouter<{
    get: import("react-query-kit").RouterQuery<LeaderboardEntry[], {
        testSeriesId?: string;
        courseId?: string;
    } | undefined, any>;
}>;
export declare const useLeaderboard: import("react-query-kit").QueryHook<LeaderboardEntry[], {
    testSeriesId?: string;
    courseId?: string;
} | undefined, Error>;
//# sourceMappingURL=index.d.ts.map