import type { LiveSession } from "../courses/index.ts";
export declare const liveSessions: import("react-query-kit").CreateRouter<{
    list: import("react-query-kit").RouterQuery<LiveSession[], {
        courseId?: string;
    } | undefined, any>;
    byId: import("react-query-kit").RouterQuery<LiveSession, {
        id: string;
    }, any>;
    add: import("react-query-kit").RouterMutation<LiveSession, any, any, any>;
    update: import("react-query-kit").RouterMutation<LiveSession, {
        id: string;
        data: any;
    }, any, any>;
    remove: import("react-query-kit").RouterMutation<void, {
        id: string;
    }, any, any>;
}>;
export declare const useLiveSessionsList: import("react-query-kit").QueryHook<LiveSession[], {
    courseId?: string;
} | undefined, Error>;
export declare const useLiveSessionDetail: import("react-query-kit").QueryHook<LiveSession, {
    id: string;
}, Error>;
export declare const useCreateLiveSession: import("react-query-kit").MutationHook<LiveSession, void, Error, any>;
export declare const useUpdateLiveSession: import("react-query-kit").MutationHook<LiveSession, {
    id: string;
    data: any;
}, Error, any>;
export declare const useDeleteLiveSession: import("react-query-kit").MutationHook<void, {
    id: string;
}, Error, any>;
//# sourceMappingURL=index.d.ts.map