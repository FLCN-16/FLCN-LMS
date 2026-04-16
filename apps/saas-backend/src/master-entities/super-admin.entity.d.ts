/**
 * MASTER DATABASE ENTITY
 *
 * Stores SaaS super administrators who manage the entire platform.
 * These users are stored in the MASTER database only.
 */
export declare class SuperAdmin {
    id: string;
    name: string;
    email: string;
    hashedPassword: string;
    isActive: boolean;
    role: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=super-admin.entity.d.ts.map