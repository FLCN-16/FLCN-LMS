import { NextRequest, NextResponse } from "next/server"

// Protected route patterns that require authentication
const protectedPatterns = [
  "/learn/",
  "/user/",
  "/test/",
  "/live/",
  "/panel/",
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the current path is a protected route
  const isProtected = protectedPatterns.some((pattern) =>
    pathname.startsWith(pattern)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get("session")

  if (!sessionCookie) {
    // Redirect to login with return URL
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("returnTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
