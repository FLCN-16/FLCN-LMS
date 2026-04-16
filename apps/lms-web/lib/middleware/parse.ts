import { NextRequest } from "next/server"

export function parseTenant(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").replace(/:(\d+)$/, "")
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "flcn-lms.io"

  const isDevEnv = process.env.NODE_ENV === "development"
  const isRootDomain = host === rootDomain || host === `www.${rootDomain}`
  const isSubdomain = host.endsWith(`.${rootDomain}`) && !isRootDomain
  const subdomain = isSubdomain ? host.replace(`.${rootDomain}`, "") : null
  const isCustomDomain = !isSubdomain && !isRootDomain

  return {
    host,
    isRootDomain,
    isSubdomain,
    subdomain,
    isCustomDomain,
    isDevEnv,
  }
}
