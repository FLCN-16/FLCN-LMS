export interface BillingRecord {
    id: string;
    customerId: string;
    planId: string;
    status: "active" | "paused" | "cancelled";
    amount: number;
    currency: string;
    billingCycle: "monthly" | "yearly";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateBillingInput {
    customerId: string;
    planId: string;
    billingCycle: "monthly" | "yearly";
}
export interface UpdateBillingInput {
    status?: "active" | "paused" | "cancelled";
    planId?: string;
}
export declare const useBillingRecords: import("react-query-kit").QueryHook<BillingRecord[], void, Error>;
export declare const useBillingRecord: import("react-query-kit").QueryHook<BillingRecord, {
    id: string;
}, Error>;
export declare const useCreateBilling: import("react-query-kit").MutationHook<any, CreateBillingInput, Error, unknown>;
export declare const useUpdateBilling: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateBillingInput;
}, Error, unknown>;
//# sourceMappingURL=index.d.ts.map