import { NextRequest } from "next/server";
export declare function parseTenant(req: NextRequest): {
    host: any;
    isRootDomain: boolean;
    isSubdomain: any;
    subdomain: any;
    isCustomDomain: boolean;
    isDevEnv: boolean;
};
//# sourceMappingURL=parse.d.ts.map