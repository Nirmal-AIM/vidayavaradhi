import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, password, role, name, userData } = await request.json()

    if (!userId || !email || !password || !role || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate role
    if (!["learner", "trainer", "policymaker"].includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 })
    }

    // Create user account
    const user = await createUser({
      email,
      password,
      role,
      name,
    })

    // Update user ID to match the generated one from registration
    if (userId !== user.id) {
      // In a real database, you'd update the user record here
      console.log(`[v0] User ID mismatch: generated ${user.id}, provided ${userId}`)
    }

    // Create session
    await createSession(user)

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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
