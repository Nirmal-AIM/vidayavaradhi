import { query } from './db';

// OTP verification functions
export async function storeOTP(email: string, otp: string, purpose: 'registration' | 'password_reset' | 'email_verification'): Promise<void> {
  try {
    // Set expiration time to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await query(
      `INSERT INTO otp_verifications (email, otp_code, purpose, expires_at) 
       VALUES (?, ?, ?, ?)`,
      [email, otp, purpose, expiresAt]
    );
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    const results = await query<any[]>(
      `SELECT * FROM otp_verifications 
       WHERE email = ? 
       AND otp_code = ? 
       AND expires_at > NOW() 
       AND is_used = FALSE 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email, otp]
    );
    
    if (!results || results.length === 0) {
      return false;
    }
    
    // Mark OTP as used
    await query(
      `UPDATE otp_verifications SET is_used = TRUE WHERE id = ?`,
      [results[0].id]
    );
    
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}

export async function cleanupExpiredOTPs(): Promise<void> {
  try {
    await query(
      `UPDATE otp_verifications 
       SET is_used = TRUE 
       WHERE expires_at < NOW() AND is_used = FALSE`
    );
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
}
