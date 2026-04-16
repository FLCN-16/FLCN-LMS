export declare const expiryTimestamp: (ts: number) => boolean;
export declare const onTimerExpire: (onExpire: () => void) => boolean;
export declare const getTimeFromSeconds: (secs: number) => {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    duration: string;
};
export declare const getSecondsFromExpiry: (expiry: number, shouldRound?: boolean) => number;
//# sourceMappingURL=time.d.ts.map