export interface SuperAdmin {
    id: string;
    email: string;
    name: string;
    role: "super_admin";
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}
export interface CreateSuperAdminInput {
    email: string;
    name: string;
    password: string;
}
export interface UpdateSuperAdminInput {
    email?: string;
    name?: string;
}
export declare const useSuperAdmins: import("react-query-kit").QueryHook<SuperAdmin[], void, Error>;
export declare const useSuperAdmin: import("react-query-kit").QueryHook<SuperAdmin, {
    id: string;
}, Error>;
export declare const useCreateSuperAdmin: import("react-query-kit").MutationHook<any, CreateSuperAdminInput, Error, unknown>;
export declare const useUpdateSuperAdmin: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateSuperAdminInput;
}, Error, unknown>;
export declare const useDeleteSuperAdmin: import("react-query-kit").MutationHook<{
    success: boolean;
}, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map