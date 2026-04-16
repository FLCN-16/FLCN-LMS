import type { CreateLiveSessionPayload, UpdateLiveSessionPayload } from "@flcn-lms/types/courses";
export declare const liveSessionsApi: {
    list: () => any;
    get: (id: string) => any;
    create: (data: CreateLiveSessionPayload) => any;
    update: (id: string, data: UpdateLiveSessionPayload) => any;
    remove: (id: string) => any;
};
//# sourceMappingURL=live-sessions.d.ts.map