export interface Customer {
    id: string;
    slug: string;
    name: string;
    email?: string;
    domain?: string;
    customDomain?: string;
    logoUrl?: string;
    planId?: string;
    maxUsers?: number;
    maxCourses?: number;
    maxStorageGb?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCustomerInput {
    name: string;
    slug: string;
    email?: string;
    customDomain?: string;
    logoUrl?: string;
    planId?: string;
    maxUsers?: number;
    maxCourses?: number;
    maxStorageGb?: number;
    isActive?: boolean;
}
export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
}
export declare const useCustomers: import("react-query-kit").QueryHook<Customer[], void, Error>;
export declare const useCustomer: import("react-query-kit").QueryHook<Customer, {
    id: string;
}, Error>;
export declare const useCreateCustomer: import("react-query-kit").MutationHook<any, CreateCustomerInput, Error, unknown>;
export declare const useUpdateCustomer: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateCustomerInput;
}, Error, unknown>;
export declare const useDeleteCustomer: import("react-query-kit").MutationHook<{
    success: boolean;
}, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map