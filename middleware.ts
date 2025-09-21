import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100 // requests per window

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `rate_limit:${ip}`

  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  current.count++
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get client IP for rate limiting
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    if (!rateLimit(ip)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "900", // 15 minutes
        },
      })
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    "/learner/dashboard",
    "/trainer/dashboard",
    "/policymaker/dashboard",
    "/learner/ai-recommendation",
    "/trainer/analytics",
    "/policymaker/insights",
  ]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const session = await verifySession(request)

    if (!session) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("returnTo", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based access control
    const userRole = session.role

    if (pathname.startsWith("/learner/") && userRole !== "learner") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/trainer/") && userRole !== "trainer") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/policymaker/") && userRole !== "policymaker") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Create response with security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https: wss:; media-src 'self' https: blob:;",
  )

  // CSRF protection for state-changing operations
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")

    if (origin && host && !origin.includes(host)) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
