import { type CreateTestSeriesPayload, type TestSeries } from "@/queries/test-series";
interface Props {
    defaultValues?: Partial<TestSeries>;
    onSubmit: (data: CreateTestSeriesPayload) => void;
    isLoading: boolean;
    submitLabel?: string;
}
export declare function SeriesForm({ defaultValues, onSubmit, isLoading, submitLabel, }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=series-form.d.ts.map