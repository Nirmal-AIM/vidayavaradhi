"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, ArrowRight, RefreshCw } from "lucide-react"

export default function LoginForm() {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId || !password) {
      setError("Please enter both User ID and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Role-based routing
        const role = data.user.role
        if (role === "learner") {
          window.location.href = "/learner/dashboard"
        } else if (role === "trainer") {
          window.location.href = "/trainer/dashboard"
        } else if (role === "policymaker") {
          window.location.href = "/policymaker/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        setError(data.error || "Invalid User ID or password")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">{"Welcome Back"}</CardTitle>
              <CardDescription>{"Sign in to your VidyaVaradhi account"}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="userId">{"User ID"}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="userId"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter your User ID (e.g., VV24010001)"
                      className="pl-10 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">{"Password"}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {"Signing in..."}
                    </>
                  ) : (
                    <>
                      {"Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <Button variant="link" className="text-sm">
                    {"Forgot your password?"}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {"Don't have an account? "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal"
                      onClick={() => (window.location.href = "/")}
                    >
                      {"Register here"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
