"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Shield, ArrowRight, RefreshCw } from "lucide-react"

export default function OTPVerification() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [devOtp, setDevOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Auto-fill survey data in development mode if not present
    if (process.env.NODE_ENV === "development") {
      const defaultSurveyData = {
        personalInfo: {
          name: "Test User",
          email: "nirmaldiploma@gmail.com",
          phone: "9999999999",
          age: 25,
          gender: "Other",
        },
        education: {
          qualification: "Graduate",
          stream: "Engineering",
        },
        preferences: {
          interestedIn: "AI/ML",
        },
      };
      if (!localStorage.getItem("learnerSurveyData")) {
        localStorage.setItem("learnerSurveyData", JSON.stringify(defaultSurveyData));
      }
    }
    // Get email from survey data
    const surveyData = localStorage.getItem("learnerSurveyData")
    if (surveyData) {
      const data = JSON.parse(surveyData)
      setEmail(data.personalInfo?.email || "")
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const sendOTP = async () => {
    if (!email) {
      setError("Email address is required")
      return
    }

    setIsSending(true)
    setError("")

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsOtpSent(true)
        setCountdown(60)
        setSuccess("OTP sent successfully to your email address")
        setError("")

        if (process.env.NODE_ENV === "development" && data.otp) {
          setDevOtp(data.otp)
          setOtp(data.otp)
          setSuccess(`OTP sent successfully! (Dev OTP: ${data.otp})`)
          // Automatically verify OTP in development mode
          setTimeout(() => {
            verifyOTP();
          }, 300);
        }
      } else {
        setError(data.error || "Failed to send OTP. Please try again.")
      }
    } catch (err) {
      console.error("[v0] Error sending OTP:", err)
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      console.log("[v0] Attempting to verify OTP:", { email, otp })

      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()
      console.log("[v0] OTP verification response:", data)

      if (response.ok) {
        // Store user data with generated user ID
        const surveyData = JSON.parse(localStorage.getItem("learnerSurveyData") || "{}")
        console.log("[v0] Survey data from localStorage:", surveyData)

        const userData = {
          ...surveyData,
          userId: data.userId,
          email,
          registrationDate: new Date().toISOString(),
          status: "verified",
        }

        console.log("[v0] Storing userData:", userData)
        localStorage.setItem("userData", JSON.stringify(userData))

        const storedData = localStorage.getItem("userData")
        console.log("[v0] Verification - stored userData:", storedData)

        router.push("/learner/user-id")
      } else {
        console.log("[v0] OTP verification failed:", data)
        setError(data.error || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      console.error("[v0] Error verifying OTP:", err)
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const resendOTP = () => {
    if (countdown === 0) {
      sendOTP()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl text-balance">{"Verify Your Email"}</CardTitle>
              <CardDescription className="text-pretty">
                {"We need to verify your email address to create your VidyaVaradhi account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isOtpSent ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">{"Email Address"}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="pl-10"
                        disabled={isOtpSent}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={sendOTP} className="w-full" disabled={isSending}>
                    {isSending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {"Sending..."}
                      </>
                    ) : (
                      <>
                        {"Send OTP"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">{"We've sent a 6-digit OTP to"}</p>
                    <p className="font-medium text-primary break-all">{email}</p>
                  </div>

                  <div>
                    <Label htmlFor="otp">{"Enter OTP"}</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                    {process.env.NODE_ENV === "development" && devOtp && (
                      <p className="text-xs text-muted-foreground mt-2">(Auto-filled dev OTP: {devOtp})</p>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription className="text-primary">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={verifyOTP} className="w-full" disabled={isVerifying || otp.length !== 6}>
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {"Verifying..."}
                      </>
                    ) : (
                      <>
                        {"Verify OTP"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{"Didn't receive the OTP?"}</p>
                    <Button
                      variant="link"
                      onClick={resendOTP}
                      disabled={countdown > 0 || isSending}
                      className="p-0 h-auto font-normal"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
