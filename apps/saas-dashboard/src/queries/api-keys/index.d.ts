export interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    enabled: boolean;
    scopes: string[];
    lastUsedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ApiKeyWithSecret extends ApiKey {
    secret?: string;
}
export interface CreateApiKeyInput {
    name: string;
    scopes: string[];
}
export interface UpdateApiKeyInput {
    name?: string;
    scopes?: string[];
}
export interface ApiKeyStats {
    total: number;
    enabled: number;
    disabled: number;
}
export declare const useApiKeys: import("react-query-kit").QueryHook<ApiKey[], void, Error>;
export declare const useApiKey: import("react-query-kit").QueryHook<ApiKey, {
    id: string;
}, Error>;
export declare const useApiKeyStats: import("react-query-kit").QueryHook<ApiKeyStats, void, Error>;
export declare const useCreateApiKey: import("react-query-kit").MutationHook<any, CreateApiKeyInput, Error, unknown>;
export declare const useUpdateApiKey: import("react-query-kit").MutationHook<any, {
    id: string;
    data: UpdateApiKeyInput;
}, Error, unknown>;
export declare const useEnableApiKey: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useDisableApiKey: import("react-query-kit").MutationHook<any, string, Error, unknown>;
export declare const useDeleteApiKey: import("react-query-kit").MutationHook<{
    success: boolean;
}, string, Error, unknown>;
//# sourceMappingURL=index.d.ts.map