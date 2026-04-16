export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string;
    amount: number;
    currency: string;
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    dueDate: string;
    paidAt?: string;
    issuedAt: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateInvoiceInput {
    customerId: string;
    amount: number;
    currency: string;
    dueDate?: string;
    items?: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
    }>;
}
export interface UpdateInvoiceInput {
    status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    dueDate?: string;
}
export interface InvoiceStats {
    total: number;
    paid: number;
    overdue: number;
    pending: number;
    totalAmount: number;
}
export declare const useInvoices: import("react-query-kit").QueryHook<Invoice[], void, Error>;
export declare const useInvoice: import("react-query-kit").QueryHook<Invoice, {
    id: string;
}, Error>;
export declare const useInvoiceStats: import("react-query-kit").QueryHook<InvoiceStats, void, Error>;
export declare const useCreateInvoice: import("react-query-kit").MutationHook<any, CreateInvoiceInput, Error, unknown>;
export declare const useUpdateInvoice: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateInvoiceInput;
}, Error, unknown>;
export declare const useMarkInvoicePaid: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useCancelInvoice: import("react-query-kit").MutationHook<any, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map