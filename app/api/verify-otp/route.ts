import { type NextRequest, NextResponse } from "next/server"
import { otpStore, cleanupExpiredOTPs } from "@/lib/otp-store"

const generateUserId = () => {
  const year = new Date().getFullYear().toString().slice(-2)
  const month = String(new Date().getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0")
  return `VV${year}${month}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    cleanupExpiredOTPs()

    console.log(`[v0] Verifying OTP for ${email}`)
    console.log(`[v0] OTP store size: ${otpStore.size}`)
    console.log(`[v0] OTP store has email: ${otpStore.has(email)}`)

    const storedData = otpStore.get(email)

    if (!storedData) {
      console.log(`[v0] No OTP found for ${email}`)
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    if (Date.now() > storedData.expires) {
      console.log(`[v0] OTP expired for ${email}`)
      otpStore.delete(email)
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    if (storedData.otp !== otp) {
      console.log(`[v0] Invalid OTP for ${email}. Expected: ${storedData.otp}, Got: ${otp}`)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid, generate user ID
    const userId = generateUserId()

    // Clean up OTP
    otpStore.delete(email)
    console.log(`[v0] OTP verified successfully for ${email}, generated userId: ${userId}`)

    return NextResponse.json({
      success: true,
      userId,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("[v0] Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP. Please try again." }, { status: 500 })
  }
}
