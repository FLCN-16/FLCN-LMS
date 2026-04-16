export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    phone?: string;
    createdAt: string;
}
export declare const users: import("react-query-kit").CreateRouter<{
    list: import("react-query-kit").RouterQuery<User[], any, any>;
    byId: import("react-query-kit").RouterQuery<User, {
        id: string;
    }, any>;
    add: import("react-query-kit").RouterMutation<User, any, any, any>;
    update: import("react-query-kit").RouterMutation<User, {
        id: string;
        data: any;
    }, any, any>;
    remove: import("react-query-kit").RouterMutation<void, {
        id: string;
    }, any, any>;
}>;
export declare const useUsersList: import("react-query-kit").QueryHook<User[], void, Error>;
export declare const useUsers: import("react-query-kit").QueryHook<User[], void, Error>;
export declare const useUserDetail: import("react-query-kit").QueryHook<User, {
    id: string;
}, Error>;
export declare const useCreateUser: import("react-query-kit").MutationHook<User, void, Error, any>;
export declare const useUpdateUser: import("react-query-kit").MutationHook<User, {
    id: string;
    data: any;
}, Error, any>;
export declare const useDeleteUser: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
//# sourceMappingURL=index.d.ts.map