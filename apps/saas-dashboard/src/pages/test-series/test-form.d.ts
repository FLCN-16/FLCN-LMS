import type { CreateTestPayload, Test } from "@/queries/test-series";
interface Props {
    defaultValues?: Partial<Test>;
    onSubmit: (data: CreateTestPayload) => void;
    isLoading: boolean;
    nextOrder?: number;
    submitLabel?: string;
}
export declare function TestForm({ defaultValues, onSubmit, isLoading, nextOrder, submitLabel, }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=test-form.d.ts.map