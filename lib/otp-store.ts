// Shared OTP store for both send-otp and verify-otp routes
// In production, this should be replaced with Redis or database storage
export const otpStore = new Map<string, { otp: string; expires: number }>()

// Cleanup expired OTPs periodically
export const cleanupExpiredOTPs = () => {
  const now = Date.now()
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expires) {
      otpStore.delete(email)
    }
  }
}
