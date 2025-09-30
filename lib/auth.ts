import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { query } from "./db"


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface User {
  id: string
  email: string
  role: "learner" | "trainer" | "policymaker"
  name: string
  createdAt: Date
  lastLogin?: Date
}

export interface Session {
  userId: string
  email: string
  role: "learner" | "trainer" | "policymaker"
  name: string
  iat: number
  exp: number
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(userData: {
  email: string
  password: string
  role: "learner" | "trainer" | "policymaker"
  name: string
}): Promise<User> {
  const userId = `VV${Date.now().toString().slice(-8)}`
  const passwordHash = await hashPassword(userData.password)
  
  try {
    await query(
      `INSERT INTO users (id, email, password_hash, name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, userData.email, passwordHash, userData.name, userData.role]
    );
    
    // Create empty profile
    await query(
      `INSERT INTO user_profiles (user_id) VALUES (?)`,
      [userId]
    );
    
    return {
      id: userId,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await query<any[]>(
      `SELECT id, email, password_hash, name, role, created_at, last_login 
       FROM users 
       WHERE email = ? AND is_active = TRUE`,
      [email]
    );
    
    if (!users || users.length === 0) return null;
    
    const user = users[0];
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) return null;
    
    // Update last login
    const now = new Date();
    await query(
      `UPDATE users SET last_login = ? WHERE id = ?`,
      [now, user.id]
    );
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: new Date(user.created_at),
      lastLogin: now,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function createSession(user: User): Promise<string> {
  const payload: Omit<Session, "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_DURATION))
    .sign(JWT_SECRET)

  // Set secure cookie
  const cookieStore = cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  })

  // Store session in database
  try {
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    await query(
      `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
      [token.substring(0, 255), user.id, expiresAt]
    );
  } catch (error) {
    console.error("Error storing session:", error);
    // Continue even if session storage fails
  }

  return token
}

export async function verifySession(request?: NextRequest): Promise<Session | null> {
  try {
    let token: string | undefined

    if (request) {
      // For middleware
      token = request.cookies.get("session")?.value
    } else {
      // For server components/actions
      const cookieStore = cookies()
      token = cookieStore.get("session")?.value
    }

    if (!token) return null

    // Verify token is valid in database
    try {
      const sessions = await query<any[]>(
        `SELECT * FROM sessions WHERE id = ? AND expires_at > NOW()`,
        [token.substring(0, 255)]
      );
      
      if (!sessions || sessions.length === 0) {
        return null;
      }
    } catch (error) {
      console.error("Session database verification failed:", error);
      // Continue with JWT verification even if database check fails
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as Session
  } catch (error) {
    console.error("Session verification failed:", error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies()
  const token = cookieStore.get("session")?.value
  
  // Remove from database if token exists
  if (token) {
    try {
      await query(
        `DELETE FROM sessions WHERE id = ?`,
        [token.substring(0, 255)]
      );
    } catch (error) {
      console.error("Error removing session from database:", error);
    }
  }
  
  cookieStore.delete("session")
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await verifySession()
  if (!session) return null

  try {
    const users = await query<any[]>(
      `SELECT id, email, name, role, created_at, last_login 
       FROM users 
       WHERE id = ? AND is_active = TRUE`,
      [session.userId]
    );
    
    if (!users || users.length === 0) return null;
    
    const user = users[0];
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: new Date(user.created_at),
      lastLogin: user.last_login ? new Date(user.last_login) : undefined,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Security utilities
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
