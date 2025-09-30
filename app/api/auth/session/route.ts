import { NextResponse } from "next/server"
import { verifySession, getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const session = await verifySession()
    
    if (!session) {
      return NextResponse.json({ user: null })
    }
    
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ user: null })
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      }
    })
  } catch (error) {
    console.error("Session retrieval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}