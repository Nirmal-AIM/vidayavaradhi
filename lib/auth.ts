import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

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

// In-memory user store (in production, use a proper database)
const users = new Map<string, User & { passwordHash: string }>()

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

  const user: User & { passwordHash: string } = {
    id: userId,
    email: userData.email,
    role: userData.role,
    name: userData.name,
    createdAt: new Date(),
    passwordHash,
  }

  users.set(userId, user)
  users.set(userData.email, user) // Also store by email for login

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.get(email)
  if (!user) return null

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) return null

  // Update last login
  user.lastLogin = new Date()

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
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

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as Session
  } catch (error) {
    console.error("Session verification failed:", error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("session")
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await verifySession()
  if (!session) return null

  const user = users.get(session.userId)
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
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
