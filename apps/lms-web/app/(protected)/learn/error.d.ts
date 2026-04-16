interface ErrorProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}
export default function LearnError({ error, reset }: ErrorProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=error.d.ts.map