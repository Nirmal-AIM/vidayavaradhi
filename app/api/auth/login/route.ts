import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession, sanitizeInput, validateEmail } from "@/lib/auth"

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function checkLoginAttempts(ip: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + LOCKOUT_DURATION })
    return true
  }

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return false
  }

  attempts.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limiting
    if (!checkLoginAttempts(ip)) {
      return NextResponse.json({ error: "Too many login attempts. Please try again in 15 minutes." }, { status: 429 })
    }

    const body = await request.json()
    const { userId, password } = body

    // Input validation
    if (!userId || !password) {
      return NextResponse.json({ error: "User ID and password are required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedUserId = sanitizeInput(userId)

    // Determine if userId is email or user ID
    const email = sanitizedUserId
    if (!validateEmail(sanitizedUserId)) {
      // If not email, assume it's a user ID - in production, you'd look up the email
      // For now, we'll treat it as email for simplicity
      return NextResponse.json({ error: "Please use your email address to sign in" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    await createSession(user)

    // Reset login attempts on successful login
    loginAttempts.delete(ip)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
