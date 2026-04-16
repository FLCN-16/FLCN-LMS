/**
 * DTO for creating a refund request
 *
 * Validates:
 * - invoiceId: Must be a valid UUID
 * - amount: Must be a positive number (>0)
 * - reason: Must be a non-empty string
 * - refundMethod: Optional payment method for refund
 * - notes: Optional additional notes
 * - type: Optional refund type (full or partial)
 */
export declare class CreateRefundDto {
    invoiceId: string;
    amount: number;
    reason: string;
    refundMethod?: string;
    notes?: string;
    type?: 'full' | 'partial';
}
//# sourceMappingURL=create-refund.dto.d.ts.map