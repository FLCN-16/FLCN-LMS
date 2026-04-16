export interface Refund {
    id: string;
    invoiceId: string;
    amount: number;
    currency: string;
    status: "pending" | "approved" | "rejected" | "processed" | "failed";
    reason?: string;
    requestedAt: string;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateRefundInput {
    invoiceId: string;
    amount: number;
    reason?: string;
}
export interface ProcessRefundInput {
    status: "approved" | "rejected";
    notes?: string;
}
export interface RefundStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    processed: number;
    totalAmount: number;
}
export declare const useRefunds: import("react-query-kit").QueryHook<Refund[], void, Error>;
export declare const useRefund: import("react-query-kit").QueryHook<Refund, {
    id: string;
}, Error>;
export declare const useRefundStats: import("react-query-kit").QueryHook<RefundStats, void, Error>;
export declare const useCreateRefund: import("react-query-kit").MutationHook<any, CreateRefundInput, Error, unknown>;
export declare const useApproveRefund: import("react-query-kit").MutationHook<any, {
    id: string;
    notes?: string;
}, Error, unknown>;
export declare const useRejectRefund: import("react-query-kit").MutationHook<any, {
    id: string;
    notes?: string;
}, Error, unknown>;
export declare const useProcessRefund: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useRetryRefund: import("react-query-kit").MutationHook<any, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map