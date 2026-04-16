import { LineItemDto } from './create-invoice.dto';
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
//# sourceMappingURL=update-invoice.dto.d.ts.map