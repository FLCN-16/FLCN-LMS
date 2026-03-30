import { NextRequest, NextResponse } from "next/server"
import { parseTenant } from "@/lib/middleware/parse"
import { resolveDomain } from "@/lib/middleware/resolve-domain"
import { tenantProxy } from "@/lib/middleware/tenant-proxy"

export default async function proxy(req: NextRequest) {
  const {
    host,
    isDevEnv,
    isRootDomain,
    isSubdomain,
    subdomain,
    isCustomDomain,
  } = parseTenant(req)

  // marketing pages, fall through
  if (isDevEnv || isRootDomain) return NextResponse.next()

  // college1.lms.io
  if (isSubdomain && subdomain) {
    return tenantProxy(req, subdomain)
  }

  // college1.com → resolve to tenant slug
  if (isCustomDomain) {
    const tenantSlug = await resolveDomain(host)
    if (!tenantSlug) {
      return NextResponse.rewrite(new URL("/domain-not-found", req.url))
    }
    return tenantProxy(req, tenantSlug)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
