import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, userId, userName } = await request.json()

    if (!email || !userId) {
      return NextResponse.json({ error: "Email and User ID are required" }, { status: 400 })
    }

    console.log("[v0] Sending User ID email to:", email)
    console.log("[v0] User ID:", userId)
    console.log("[v0] User Name:", userName)

    const emailContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">VidyaVaradhi</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your Learning Journey Begins</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome ${userName || "Learner"}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Congratulations! Your VidyaVaradhi account has been successfully created. 
            Your unique User ID is ready for you to begin your learning journey.
          </p>
          
          <div style="background: #f8fafc; border: 2px solid #3b82f6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Your User ID</p>
            <div style="color: #1e40af; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace; background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">${userId}</div>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Important:</strong> Please save this User ID safely. You will need it to log in to your account along with your password.
            </p>
          </div>

          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px;">Next Steps:</h3>
            <ol style="color: #0369a1; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Save your User ID: <strong>${userId}</strong></li>
              <li>Visit the login page at <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://vidayavaradhi.gudlavallerucollege.online"}/login" style="color: #2563eb;">VidyaVaradhi Login</a></li>
              <li>Enter your User ID and the password you created</li>
              <li>Start your personalized learning journey!</li>
            </ol>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            © 2024 VidyaVaradhi. All rights reserved. | Educational Excellence Platform<br>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `

    try {
      const apiKey = process.env.RESEND_API_KEY
      if (apiKey && apiKey.startsWith("re_")) {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "VidyaVaradhi <no-reply@vidayavaradhi.gudlavallerucollege.online>",
            to: [email],
            subject: `Welcome to VidyaVaradhi - Your User ID: ${userId}`,
            html: emailContent,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log("[v0] User ID email sent successfully via Resend:", result.id)
          return NextResponse.json({
            success: true,
            message: "User ID sent successfully to your email",
            messageId: result.id,
          })
        } else {
          console.error("[v0] Resend API error:", await response.text())
        }
      }
    } catch (error) {
      console.error("[v0] Email sending error:", error)
    }

    // Fallback logging for development
    console.log("[v0] Fallback - User ID email content:")
    console.log(emailContent)

    return NextResponse.json({
      success: true,
      message: "User ID processed successfully",
      // Include userId in development for testing
      ...(process.env.NODE_ENV === "development" && { userId }),
    })
  } catch (error) {
    console.error("[v0] Error sending User ID email:", error)
    return NextResponse.json({ error: "Failed to send User ID email" }, { status: 500 })
  }
}
