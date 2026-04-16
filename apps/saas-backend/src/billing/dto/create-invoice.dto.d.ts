export declare class LineItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateInvoiceDto {
    billingId: string;
    stripeInvoiceId?: string;
    invoiceNumber?: string;
    invoiceDate: Date;
    periodStart: Date;
    periodEnd: Date;
    lineItems?: LineItemDto[];
    amountPaid?: number;
    currency?: string;
    status?: string;
    paymentMethod?: string;
    dueDate?: Date;
    notes?: string;
    receiptId?: string;
}
export declare class UpdateInvoiceDto {
    invoiceNumber?: string;
    invoiceDate?: Date;
    periodStart?: Date;
    periodEnd?: Date;
    lineItems?: LineItemDto[];
    amountPaid?: number;
    currency?: string;
    status?: string;
    paymentMethod?: string;
    dueDate?: Date;
    paidDate?: Date;
    notes?: string;
    receiptId?: string;
}
export declare class InvoiceResponseDto {
    id: string;
    billingId: string;
    invoiceNumber?: string;
    invoiceDate: Date;
    periodStart: Date;
    periodEnd: Date;
    amount: number;
    amountPaid: number;
    amountDue: number;
    currency: string;
    status: string;
    lineItems?: Record<string, unknown>[];
    paymentMethod?: string;
    paidDate?: Date;
    dueDate?: Date;
    notes?: string;
    receiptId?: string;
    isSent: boolean;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InvoiceStatsDto {
    totalInvoices: number;
    totalAmount: number;
    totalPaid: number;
    totalDue: number;
    paidInvoices: number;
    overdueInvoices: number;
}
//# sourceMappingURL=create-invoice.dto.d.ts.map