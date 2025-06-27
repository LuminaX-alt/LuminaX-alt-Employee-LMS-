"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Heart, Activity, Lock, UserPlus } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { authenticateUser } from "@/lib/auth"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = authenticateUser(username, password)

    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Please check your username and password.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 medical-pattern opacity-30"></div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Floating Healthcare Icons */}
      <div className="absolute top-20 left-20 text-blue-200 dark:text-blue-800 opacity-20">
        <Heart className="h-16 w-16" />
      </div>
      <div className="absolute bottom-20 right-20 text-cyan-200 dark:text-cyan-800 opacity-20">
        <Activity className="h-20 w-20" />
      </div>
      <div className="absolute top-1/2 left-10 text-blue-300 dark:text-blue-700 opacity-15">
        <Shield className="h-12 w-12" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="healthcare-card backdrop-blur-sm bg-card/95 border-0 shadow-2xl">
          <CardHeader className="text-center pb-2 space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40 p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Image src="/logo.png" alt="LuminaX-Alt Logo" fill className="object-contain p-2" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                LuminaX-Alt
              </CardTitle>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Healthcare Management System
              </p>
              <CardDescription className="text-base text-muted-foreground">
                Where Intelligent Clinics Meet Surgical Excellence
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12 border-2 focus:border-blue-500 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 healthcare-button text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="flex items-center justify-between mt-4">
                <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Forgot your password?
                </Button>
                <Link href="/register">
                  <Button variant="link" className="text-sm text-green-600 hover:text-green-700 dark:text-green-400">
                    <UserPlus className="h-4 w-4 mr-1" />
                    New Employee?
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="h-4 w-4 text-blue-600" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Healthcare Certified</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 LuminaX-Alt. All rights reserved. HIPAA Compliant.</p>
        </div>
      </div>
    </div>
  )
}
