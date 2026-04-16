export interface InstituteStats {
    counts: {
        students: number;
        instructor: number;
        courses: number;
        activeSessions: number;
    };
    todaySessions: number;
    recentEnrollments: any[];
}
export declare function getInstituteStats(instituteSlug: string): Promise<any>;
//# sourceMappingURL=stats.d.ts.map