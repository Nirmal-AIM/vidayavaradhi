interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export const sendEmail = async ({ to, subject, html, from = "VidyaVaradhi <onboarding@resend.dev>" }: EmailOptions) => {
  try {
    const apiKey = process.env.RESEND_API_KEY

    console.log(`[v0] Email Service - Attempting to send email`)
    console.log(`[v0] To: ${to}`)
    console.log(`[v0] From: ${from}`)
    console.log(`[v0] API Key present: ${!!apiKey}`)

    if (!apiKey || apiKey.trim() === "") {
      console.log(`[v0] Email Service Not Configured - Development Mode`)
      console.log(`[v0] Would send email to: ${to}`)
      console.log(`[v0] Subject: ${subject}`)
      console.log(`[v0] From: ${from}`)

      return {
        success: true,
        messageId: `dev_${Date.now()}`,
        message: "Email logged to console (development mode)",
      }
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    })

    const responseText = await response.text()
    console.log(`[v0] Resend Response Status: ${response.status}`)
    console.log(`[v0] Resend Response Body: ${responseText}`)

    if (!response.ok) {
      console.error(`[v0] Email API error: ${response.status} ${response.statusText}`)
      console.error(`[v0] Response details: ${responseText}`)

      return {
        success: false,
        error: `Email API error: ${response.status} - ${responseText}`,
        messageId: null,
      }
    }

    const result = JSON.parse(responseText)
    console.log(`[v0] Email sent successfully! Message ID: ${result.id}`)

    return {
      success: true,
      messageId: result.id,
      message: "Email sent successfully",
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

export const createEmailTemplate = (title: string, content: string, additionalStyles?: string) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); ${additionalStyles || ""}">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">VidyaVaradhi</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Educational Excellence Platform</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">${title}</h2>
        ${content}
      </div>
      <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
          © 2024 VidyaVaradhi. All rights reserved. | Educational Excellence Platform
        </p>
      </div>
    </div>
  `
}
