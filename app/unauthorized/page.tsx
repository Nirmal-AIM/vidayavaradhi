"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl text-red-900">{"Access Denied"}</CardTitle>
              <CardDescription className="text-red-700">
                {"You don't have permission to access this page."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-slate-600">
                  {
                    "This page is restricted to specific user roles. Please contact your administrator if you believe this is an error."
                  }
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => window.history.back()} variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button onClick={() => (window.location.href = "/")} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
