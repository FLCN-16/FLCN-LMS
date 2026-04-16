export interface Subscription {
    id: string;
    licenseId: string;
    customerId: string;
    planId: string;
    status: "active" | "paused" | "cancelled" | "expired";
    billingCycle: "monthly" | "yearly";
    nextBillingDate?: Date;
    amount: number;
    currency: string;
    stripeSubscriptionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateSubscriptionInput {
    licenseId: string;
    planId: string;
    billingCycle: "monthly" | "yearly";
}
export interface UpdateSubscriptionInput {
    status?: "active" | "paused" | "cancelled";
}
export interface SubscriptionStats {
    total: number;
    active: number;
    paused: number;
    cancelled: number;
    expired: number;
}
export declare const useSubscriptions: import("react-query-kit").QueryHook<Subscription[], void, Error>;
export declare const useSubscription: import("react-query-kit").QueryHook<Subscription, {
    id: string;
}, Error>;
export declare const useCustomerSubscriptions: import("react-query-kit").QueryHook<Subscription[], {
    customerId: string;
}, Error>;
export declare const useSubscriptionStats: import("react-query-kit").QueryHook<SubscriptionStats, void, Error>;
export declare const useCreateSubscription: import("react-query-kit").MutationHook<any, CreateSubscriptionInput, Error, unknown>;
export declare const useUpdateSubscription: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateSubscriptionInput;
}, Error, unknown>;
export declare const useCancelSubscription: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useRetryPayment: import("react-query-kit").MutationHook<any, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map