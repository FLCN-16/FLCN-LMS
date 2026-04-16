import { Institute } from './institute.entity';
import { Plan } from './plan.entity';
import { SuperAdmin } from './super-admin.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Stores license information for institutes.
 * Tracks license keys, validity, features, and expiry dates.
 * These definitions are stored in the MASTER database only.
 */
export declare class License {
    id: string;
    licenseKey: string;
    organizationName: string;
    status: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';
    isValid: boolean;
    expiryDate?: Date;
    features: Array<{
        name: string;
        enabled: boolean;
        limit?: number;
    }>;
    maxUsers: number;
    planId?: string;
    plan?: Plan;
    instituteId?: string;
    institute?: Institute;
    issuedById?: string;
    issuedBy?: SuperAdmin;
    notes?: string;
    lastVerifiedAt?: Date;
    verificationCount: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=license.entity.d.ts.map