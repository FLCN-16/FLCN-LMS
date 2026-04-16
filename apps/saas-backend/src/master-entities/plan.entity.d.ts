/**
 * MASTER DATABASE ENTITY
 *
 * Stores SaaS subscription plans (e.g., Free, Pro, Enterprise).
 * These definitions are stored in the MASTER database only.
 */
export declare class Plan {
    id: string;
    name: string;
    description?: string;
    priceMonthly: number;
    priceYearly: number;
    features: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=plan.entity.d.ts.map