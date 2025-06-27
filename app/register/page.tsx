"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Shield, UserPlus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { registerEmployee, COMPANY_TOKEN } from "@/lib/auth"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    designation: "",
    token: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const departments = [
    "Technology",
    "Finance",
    "Human Resources",
    "Marketing",
    "Operations",
    "Medical Affairs",
    "Research & Development",
    "Quality Assurance",
    "Customer Support",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.department ||
      !formData.designation ||
      !formData.token
    ) {
      return "All fields are required"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long"
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email address"
    }

    if (formData.token !== COMPANY_TOKEN) {
      return "Invalid company registration token"
    }

    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const registrationSuccess = registerEmployee(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        designation: formData.designation,
      },
      formData.token,
    )

    if (registrationSuccess) {
      setSuccess("Registration successful! You can now login with your credentials.")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } else {
      setError("Registration failed. Please check your company token.")
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

      {/* Back to Login */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="healthcare-card backdrop-blur-sm bg-card/95 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4 space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Image src="/logo.png" alt="LuminaX-Alt Logo" fill className="object-contain p-2" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center space-x-2">
                <UserPlus className="h-6 w-6 text-blue-600" />
                <span>Employee Registration</span>
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Join the LuminaX-Alt Healthcare Team
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="John Doe"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@luminax-alt.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold">
                    Department
                  </Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-sm font-semibold">
                    Job Title
                  </Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="Software Engineer"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    required
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-11 pr-12 border-2 focus:border-blue-500 transition-colors"
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-11 pr-12 border-2 focus:border-blue-500 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-semibold flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Company Registration Token</span>
                </Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter company-provided token"
                  value={formData.token}
                  onChange={(e) => handleInputChange("token", e.target.value)}
                  required
                  className="h-11 border-2 focus:border-blue-500 transition-colors font-mono"
                />
                <p className="text-xs text-muted-foreground">Contact HR department for your registration token</p>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Employee Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Registration Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            © 2024 LuminaX-Alt. All rights reserved. HIPAA Compliant Healthcare System.
          </p>
        </div>
      </div>
    </div>
  )
}
