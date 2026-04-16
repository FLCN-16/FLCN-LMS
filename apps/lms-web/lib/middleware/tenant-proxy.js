import { NextResponse } from "next/server";
import { COOKIES } from "@/lib/cookies";
const PROTECTED_PATHS = ["/learn", "/user", "/test", "/live", "/checkout"];
export async function tenantProxy(req, tenantSlug) {
    const url = req.nextUrl.clone();
    const path = url.pathname;
    // Auth guard
    const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
    if (isProtected) {
        // Next.js RequestCookies handles encoded names automatically
        const token = req.cookies.get(COOKIES.AUTH_TOKEN)?.value;
        if (!token) {
            const loginUrl = new URL("/auth/login", req.url);
            loginUrl.searchParams.set("next", path);
            return NextResponse.redirect(loginUrl);
        }
    }
    // Rewrite to internal tenant route
    url.pathname = `/tenant/${tenantSlug}${path}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-tenant-slug", tenantSlug);
    res.headers.set("x-tenant-host", req.headers.get("host") ?? "");
    return res;
}
