export interface Plan {
    id: string;
    name: string;
    description?: string;
    priceMonthly: number;
    priceYearly: number;
    features?: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreatePlanInput {
    name: string;
    description?: string;
    priceMonthly: number;
    priceYearly: number;
    features?: Record<string, any>;
    isActive?: boolean;
}
export interface UpdatePlanInput extends Partial<CreatePlanInput> {
}
export declare const usePlans: import("react-query-kit").QueryHook<Plan[], void, Error>;
export declare const usePlan: import("react-query-kit").QueryHook<Plan, {
    id: string;
}, Error>;
export declare const useCreatePlan: import("react-query-kit").MutationHook<any, CreatePlanInput, Error, unknown>;
export declare const useUpdatePlan: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdatePlanInput;
}, Error, unknown>;
export declare const useDeletePlan: import("react-query-kit").MutationHook<{
    success: boolean;
}, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map