export interface Feature {
    name: string;
    enabled: boolean;
    limit?: number;
}
export interface License {
    id: string;
    licenseKey: string;
    organizationName: string;
    status: "active" | "expired" | "invalid" | "suspended" | "pending";
    isValid: boolean;
    expiryDate?: Date;
    features: Feature[];
    maxUsers: number;
    lastVerifiedAt?: Date;
    verificationCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface LicenseListResponse {
    data: License[];
    total: number;
    skip: number;
    take: number;
}
export interface IssueLicenseInput {
    organizationName: string;
    licenseKey: string;
    planId?: string;
    instituteId?: string;
    expiryDate?: string;
    features?: Feature[];
    maxUsers?: number;
    notes?: string;
}
export interface UpdateLicenseInput {
    organizationName?: string;
    status?: "active" | "expired" | "invalid" | "suspended" | "pending";
    expiryDate?: string;
    features?: Feature[];
    maxUsers?: number;
    notes?: string;
}
export interface LicenseStats {
    total: number;
    active: number;
    expired: number;
    suspended: number;
    invalid: number;
}
export declare const useLicenses: import("react-query-kit").QueryHook<LicenseListResponse, void | {
    skip?: number;
    take?: number;
    search?: string;
    status?: string;
}, Error>;
export declare const useLicense: import("react-query-kit").QueryHook<License, {
    id: string;
}, Error>;
export declare const useLicenseByKey: import("react-query-kit").QueryHook<License, {
    key: string;
}, Error>;
export declare const useLicenseStats: import("react-query-kit").QueryHook<LicenseStats, void, Error>;
export declare const useLicenseFeatures: import("react-query-kit").QueryHook<Feature[], {
    key: string;
}, Error>;
export declare const useIssueLicense: import("react-query-kit").MutationHook<any, IssueLicenseInput, Error, unknown>;
export declare const useUpdateLicense: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateLicenseInput;
}, Error, unknown>;
export declare const useSuspendLicense: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useReactivateLicense: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useRevokeLicense: import("react-query-kit").MutationHook<{
    success: boolean;
}, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map