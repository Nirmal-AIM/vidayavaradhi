"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Eye, EyeOff, CheckCircle, ArrowRight, Mail } from "lucide-react"

export default function UserIdDisplay() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [isCreatingPassword, setIsCreatingPassword] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [selectedRole, setSelectedRole] = useState<"learner" | "trainer" | "policymaker">("learner")

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("userData")
    console.log("[v0] Raw userData from localStorage:", userData)

    if (userData) {
      const data = JSON.parse(userData)
      console.log("[v0] Parsed userData:", data)
      console.log("[v0] userId from data:", data.userId)

      setUserId(data.userId || "")
      setEmail(data.email || "")

      if (data.userId && data.email && !isEmailSent) {
        sendUserIdToEmail(data.userId, data.email, data.personalInfo?.name)
      }
    } else {
      console.log("[v0] No userData found in localStorage")
    }
  }, [isEmailSent])

  const sendUserIdToEmail = async (userIdToSend: string, emailToSend: string, userName?: string) => {
    try {
      const response = await fetch("/api/send-user-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailToSend,
          userId: userIdToSend,
          userName: userName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEmailSent(true)
        console.log("[v0] User ID sent to email successfully")
      } else {
        setEmailError(data.error || "Failed to send User ID to email")
        console.error("[v0] Failed to send User ID to email:", data.error)
      }
    } catch (err) {
      console.error("[v0] Error sending User ID to email:", err)
      setEmailError("Failed to send User ID to email")
    }
  }

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("[v0] Failed to copy user ID:", err)
    }
  }

  const createPassword = async () => {
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      return
    }

    setIsCreatingPassword(true)
    setError("")

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")

      // Create user account with new authentication system
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          password,
          role: selectedRole,
          name: userData.personalInfo?.name || "User",
          userData: userData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Clear localStorage and redirect based on role
        localStorage.removeItem("userData")
        localStorage.removeItem("otpData")

        if (selectedRole === "learner") {
          router.push("/learner/ai-recommendation")
        } else if (selectedRole === "trainer") {
          router.push("/trainer/dashboard")
        } else if (selectedRole === "policymaker") {
          router.push("/policymaker/dashboard")
        }
      } else {
        setError(data.error || "Failed to create account")
      }
    } catch (err) {
      console.error("[v0] Error creating account:", err)
      setError("Failed to create account. Please try again.")
    } finally {
      setIsCreatingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl text-balance">{"Account Created Successfully!"}</CardTitle>
              <CardDescription className="text-pretty">
                {"Your VidyaVaradhi account has been created. Please save your User ID and create a password."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User ID Display */}
              <div className="space-y-2">
                <Label>{"Your User ID"}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={userId}
                    readOnly
                    className="font-mono text-lg font-semibold text-center bg-muted/50 border-2"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyUserId}
                    className="shrink-0 hover:bg-primary/10 bg-transparent"
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"This is your unique User ID. Please save it safely as you'll need it to log in."}
                </p>
              </div>

              {/* Email Confirmation */}
              <Alert
                className={`border-primary/20 ${isEmailSent ? "bg-primary/5" : emailError ? "bg-destructive/5 border-destructive/20" : "bg-muted/30"}`}
              >
                <Mail className={`h-4 w-4 ${emailError ? "text-destructive" : "text-primary"}`} />
                <AlertDescription>
                  {isEmailSent ? (
                    <>
                      {"We've sent your User ID to"} <strong className="text-primary">{email}</strong>.{" "}
                      {"Please check your email and save it for future reference."}
                    </>
                  ) : emailError ? (
                    <span className="text-destructive">{emailError}</span>
                  ) : (
                    <>
                      {"Sending User ID to"} <strong>{email}</strong>
                      {"..."}
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {/* Role Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{"Select Your Role"}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedRole === "learner"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-muted hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedRole("learner")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedRole === "learner"
                            ? "bg-primary border-primary"
                            : "border-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {selectedRole === "learner" && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Learner</h4>
                        <p className="text-sm text-muted-foreground">Access learning resources and track progress</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedRole === "trainer"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-muted hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedRole("trainer")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedRole === "trainer"
                            ? "bg-primary border-primary"
                            : "border-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {selectedRole === "trainer" && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Trainer</h4>
                        <p className="text-sm text-muted-foreground">Manage courses and mentor learners</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedRole === "policymaker"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-muted hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedRole("policymaker")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedRole === "policymaker"
                            ? "bg-primary border-primary"
                            : "border-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {selectedRole === "policymaker" && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Policy Maker</h4>
                        <p className="text-sm text-muted-foreground">Access analytics and policy insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Creation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{"Create Your Password"}</h3>

                <div className="space-y-2">
                  <Label htmlFor="password">{"Password"}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{"Confirm Password"}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p className="font-medium mb-2">{"Password requirements:"}</p>
                  <ul className="list-disc list-inside space-y-1 leading-relaxed">
                    <li>{"At least 8 characters long"}</li>
                    <li>{"At least one uppercase letter (A-Z)"}</li>
                    <li>{"At least one lowercase letter (a-z)"}</li>
                    <li>{"At least one number (0-9)"}</li>
                    <li>{"Special characters recommended"}</li>
                  </ul>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={createPassword}
                  className="w-full"
                  size="lg"
                  disabled={isCreatingPassword || !password || !confirmPassword}
                >
                  {isCreatingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {"Creating Account..."}
                    </>
                  ) : (
                    <>
                      {"Complete Registration"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
