import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession, sanitizeInput, validateEmail } from "@/lib/auth"

import { query } from "@/lib/db"

// Rate limiting for login attempts
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

async function checkLoginAttempts(ip: string): Promise<boolean> {
  try {
    const now = new Date()
    const resetTime = new Date(now.getTime() + LOCKOUT_DURATION)
    
    // Check if IP exists and get attempt count
    const results = await query<any[]>(
      `SELECT * FROM login_attempts WHERE ip = ? AND reset_time > NOW()`,
      [ip]
    )
    
    if (!results || results.length === 0) {
      // First attempt, create record
      await query(
        `INSERT INTO login_attempts (ip, attempt_count, reset_time) VALUES (?, 1, ?)`,
        [ip, resetTime]
      )
      return true
    }
    
    const attempt = results[0]
    
    if (attempt.attempt_count >= MAX_LOGIN_ATTEMPTS) {
      return false
    }
    
    // Increment attempt count
    await query(
      `UPDATE login_attempts SET attempt_count = attempt_count + 1 WHERE ip = ?`,
      [ip]
    )
    
    return true
  } catch (error) {
    console.error("Error checking login attempts:", error)
    return true // Allow login on error to prevent lockout
  }
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
    await query(`DELETE FROM login_attempts WHERE ip = ?`, [ip])

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
