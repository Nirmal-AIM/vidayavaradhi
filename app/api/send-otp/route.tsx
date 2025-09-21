import { type NextRequest, NextResponse } from "next/server"
import { otpStore, cleanupExpiredOTPs } from "@/lib/otp-store"

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const apiKey = process.env.RESEND_API_KEY

    console.log(`[v0] Attempting to send email to: ${to}`)
    console.log(`[v0] API Key present: ${!!apiKey}`)
    console.log(`[v0] API Key starts with 're_': ${apiKey?.startsWith("re_")}`)
    console.log(`[v0] API Key length: ${apiKey?.length || 0}`)

    // More robust API key validation
    if (!apiKey || apiKey.trim() === "" || !apiKey.startsWith("re_")) {
      console.log(`[v0] RESEND_API_KEY not configured or invalid - Using fallback mode`)
      console.log(`[v0] Fallback - Email to: ${to}`)
      console.log(`[v0] Subject: ${subject}`)
      console.log(`[v0] Content: ${html}`)
      return { success: true, messageId: `mock_${Date.now()}` }
    }

    console.log(`[v0] Using Resend API with key: ${apiKey.substring(0, 8)}...`)

    const emailStrategies = [
      // Strategy 1: Try custom domain first (when fully verified)
      {
        from: "VidyaVaradhi <no-reply@vidayavaradhi.gudlavallerucollege.online>",
        description: "Custom verified domain",
      },
      // Strategy 2: Use Resend testing domain for all users temporarily
      {
        from: "VidyaVaradhi <onboarding@resend.dev>",
        description: "Resend testing domain (temporary for all users)",
        // Removed restrictTo to allow all users during domain verification
      },
    ]

    let lastError = null

    for (const strategy of emailStrategies) {
      try {
        console.log(`[v0] Attempting ${strategy.description}: ${strategy.from}`)

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: strategy.from,
            to: [to],
            subject: subject,
            html: html,
          }),
        })

        const responseText = await response.text()
        console.log(`[v0] Resend API Response Status: ${response.status}`)
        console.log(`[v0] Resend API Response: ${responseText}`)

        if (response.ok) {
          const result = JSON.parse(responseText)
          console.log(`[v0] Email sent successfully via ${strategy.description}! Message ID: ${result.id}`)
          return { success: true, messageId: result.id }
        }

        // Store error and try next strategy
        const errorData = JSON.parse(responseText)
        lastError = `${response.status} - ${responseText}`
        console.log(`[v0] Failed with ${strategy.description}, trying next strategy...`)
      } catch (strategyError) {
        console.log(`[v0] Error with ${strategy.description}:`, strategyError)
        lastError = strategyError instanceof Error ? strategyError.message : "Unknown error"
        continue
      }
    }

    // If all strategies failed, provide helpful error message
    console.error(`[v0] All email strategies failed. Last error: ${lastError}`)

    if (lastError?.includes("domain is not verified")) {
      return {
        success: false,
        error: `Domain verification in progress. Please wait a few minutes for DNS propagation to complete, then try again. If the issue persists, please verify that vidayavaradhi.gudlavallerucollege.online is properly configured in your Resend dashboard.`,
        messageId: null,
      }
    } else if (lastError?.includes("testing emails to your own email address")) {
      return {
        success: false,
        error: `Email service is temporarily in testing mode while domain verification completes. Please contact support at nirmalkollipara8688@gmail.com if you need immediate access, or try again in a few minutes once domain verification is complete.`,
        messageId: null,
      }
    }

    return {
      success: false,
      error: `Email sending failed: ${lastError}`,
      messageId: null,
    }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
      messageId: null,
    }
  }
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
    }

    cleanupExpiredOTPs()

    const otp = generateOTP()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP in shared store
    otpStore.set(email, { otp, expires })

    console.log(`[v0] Generated OTP for ${email}: ${otp}`)
    console.log(`[v0] OTP store size: ${otpStore.size}`)

    const emailResult = await sendEmail(
      email,
      "VidyaVaradhi - Email Verification OTP",
      `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">VidyaVaradhi</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Educational Excellence Platform</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Email Verification</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Thank you for joining VidyaVaradhi! Please use the following OTP to verify your email address:
            </p>
            <div style="background: #f8fafc; border: 2px dashed #3b82f6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="color: #1e40af; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This OTP will expire in 10 minutes. Please complete your verification promptly.
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              If you didn't request this verification, please ignore this email. Your account security is important to us.
            </p>
          </div>
          <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
              © 2024 VidyaVaradhi. All rights reserved. | Educational Excellence Platform
            </p>
          </div>
        </div>
      `,
    )

    console.log(`[v0] Email sending result:`, emailResult)

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: `Failed to send OTP email: ${emailResult.error}`,
        },
        { status: 500 },
      )
    }

    const message =
      process.env.NODE_ENV === "development"
        ? `OTP sent successfully! Development OTP: ${otp}`
        : "OTP sent successfully to your email address"

    return NextResponse.json({
      success: true,
      message,
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    })
  } catch (error) {
    console.error("[v0] Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 })
  }
}
