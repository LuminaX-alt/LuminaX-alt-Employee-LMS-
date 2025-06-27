"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Building2,
  UserPlus,
  UserMinus,
  PiggyBank,
  FileText,
  ChevronDown,
  Activity,
  Shield,
  Stethoscope,
  ClipboardList,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { getTimeBasedGreeting } from "@/lib/auth"

interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

const getCEOMenuItems = () => [
  {
    title: "Dashboard Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Financial Management",
    items: [
      { title: "Revenue & Sales", url: "/dashboard/sales", icon: TrendingUp },
      { title: "Expenses", url: "/dashboard/expenses", icon: CreditCard },
      { title: "Purchases", url: "/dashboard/purchases", icon: DollarSign },
      { title: "Loans & Financing", url: "/dashboard/loans", icon: PiggyBank },
    ],
  },
  {
    title: "Human Resources",
    items: [
      { title: "All Employees", url: "/dashboard/employees", icon: Users },
      { title: "New Hire", url: "/dashboard/employees/new", icon: UserPlus },
      { title: "Resignations", url: "/dashboard/employees/resign", icon: UserMinus },
      { title: "Payroll Management", url: "/dashboard/salary", icon: FileText },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Meetings", url: "/dashboard/meetings", icon: Calendar },
      { title: "Executive Meetings", url: "/dashboard/ceo-meetings", icon: Building2 },
      { title: "Healthcare Operations", url: "/dashboard/operations", icon: Stethoscope },
    ],
  },
  {
    title: "System Administration",
    items: [
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
      { title: "Security", url: "/dashboard/security", icon: Shield },
    ],
  },
]

const getEmployeeMenuItems = () => [
  {
    title: "My Dashboard",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "My Work",
    items: [
      { title: "Tasks", url: "/dashboard/tasks", icon: ClipboardList },
      { title: "My Schedule", url: "/dashboard/schedule", icon: Calendar },
      { title: "Performance", url: "/dashboard/performance", icon: BarChart3 },
    ],
  },
  {
    title: "Team",
    items: [
      { title: "Team Members", url: "/dashboard/team", icon: Users },
      { title: "Meetings", url: "/dashboard/meetings", icon: Calendar },
    ],
  },
  {
    title: "Personal",
    items: [{ title: "Profile", url: "/dashboard/profile", icon: Settings }],
  },
]

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()
  const menuItems = user.role === "CEO" ? getCEOMenuItems() : getEmployeeMenuItems()
  const greeting = getTimeBasedGreeting()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border/50 bg-card/50 backdrop-blur-sm">
          <SidebarHeader className="border-b border-border/50 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-1 shadow-lg">
                <Image src="/logo.png" alt="LuminaX-Alt" fill className="object-contain p-1" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  LuminaX-Alt
                </h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Healthcare Dashboard
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            {menuItems.map((group) => (
              <SidebarGroup key={group.title} className="mb-4">
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="healthcare-card hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-lg mx-1"
                        >
                          <Link href={item.url} className="flex items-center space-x-3 px-3 py-2">
                            <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start healthcare-card hover:bg-blue-100 dark:hover:bg-blue-900/30 p-3 h-auto"
                >
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-blue-200 dark:ring-blue-800">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                      {user.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-muted-foreground font-medium">{user.designation}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 healthcare-card">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Settings className="mr-2 h-4 w-4 text-blue-600" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Shield className="mr-2 h-4 w-4 text-green-600" />
                  Security
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-6 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger className="-ml-1 healthcare-button text-white" />
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {greeting}, {user.username.split(" ")[0]} •{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-6 bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
