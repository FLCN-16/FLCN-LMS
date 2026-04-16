interface UseTimerOptions {
    startTimestamp: number;
    expiryTimestamp: number;
    onTimeExpire?: () => void;
    onRangeChange?: (isInRange: boolean, currentTimestamp: number, startTimestamp: number, expiryTimestamp: number) => void;
    startTimestampMargin?: number;
    endTimestampMargin?: number;
    onMarginRangeChange?: (isInMarginRange: boolean, currentTimestamp: number, startTimestamp: number, expiryTimestamp: number) => void;
    autoStart?: boolean;
}
export default function useTimer({ startTimestamp, expiryTimestamp: expiry, onTimeExpire, onRangeChange, startTimestampMargin, // Seconds
endTimestampMargin, // Seconds
onMarginRangeChange, autoStart, }: UseTimerOptions): any;
export {};
//# sourceMappingURL=use-timer.d.ts.map