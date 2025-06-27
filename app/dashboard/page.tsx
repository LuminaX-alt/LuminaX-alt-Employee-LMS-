"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CreditCard,
  Activity,
  Heart,
  Shield,
  Stethoscope,
  AlertTriangle,
  Clock,
  Target,
  Award,
  CheckCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
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

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 2400000, expenses: 1800000 },
  { month: "Feb", revenue: 2600000, expenses: 1900000 },
  { month: "Mar", revenue: 2800000, expenses: 2000000 },
  { month: "Apr", revenue: 3200000, expenses: 2100000 },
  { month: "May", revenue: 2900000, expenses: 1950000 },
  { month: "Jun", revenue: 3100000, expenses: 2050000 },
]

const departmentData = [
  { name: "Technology", value: 35, color: "#3B82F6" },
  { name: "Medical Affairs", value: 25, color: "#10B981" },
  { name: "Operations", value: 20, color: "#F59E0B" },
  { name: "Finance", value: 12, color: "#EF4444" },
  { name: "HR", value: 8, color: "#8B5CF6" },
]

const performanceData = [
  { metric: "Patient Satisfaction", current: 94, target: 95 },
  { metric: "Equipment Uptime", current: 98, target: 99 },
  { metric: "Staff Efficiency", current: 87, target: 90 },
  { metric: "Cost Control", current: 92, target: 88 },
]

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const greeting = getTimeBasedGreeting()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const isCEO = user.role === "CEO"

  const ceoStats = [
    {
      title: "Total Revenue",
      value: "$18.2M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "YTD healthcare revenue",
    },
    {
      title: "Operating Expenses",
      value: "$11.8M",
      change: "-3.2%",
      trend: "down",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "YTD operational costs",
    },
    {
      title: "Active Staff",
      value: "247",
      change: "+15",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      description: "Healthcare professionals",
    },
    {
      title: "Patient Satisfaction",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      description: "Patient satisfaction rate",
    },
  ]

  const employeeStats = [
    {
      title: "My Tasks",
      value: "12",
      change: "3 pending",
      trend: "neutral",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "Active assignments",
    },
    {
      title: "Performance Score",
      value: "92%",
      change: "+5%",
      trend: "up",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Monthly performance",
    },
    {
      title: "Hours This Week",
      value: "38.5",
      change: "1.5 remaining",
      trend: "neutral",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      description: "Work hours logged",
    },
    {
      title: "Team Projects",
      value: "4",
      change: "2 active",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      description: "Collaborative projects",
    },
  ]

  const stats = isCEO ? ceoStats : employeeStats

  const recentTransactions = [
    {
      id: 1,
      type: "Revenue",
      amount: "+$45,000",
      client: "MedTech Solutions",
      date: "2024-01-15",
      category: "Equipment Sale",
    },
    {
      id: 2,
      type: "Expense",
      amount: "-$8,200",
      client: "Medical Supplies Co.",
      date: "2024-01-14",
      category: "Inventory",
    },
    {
      id: 3,
      type: "Payroll",
      amount: "-$125,000",
      client: "Monthly Staff Payroll",
      date: "2024-01-13",
      category: "Salaries",
    },
    {
      id: 4,
      type: "Revenue",
      amount: "+$28,500",
      client: "Healthcare Insurance",
      date: "2024-01-12",
      category: "Insurance Claims",
    },
  ]

  const upcomingMeetings = [
    {
      id: 1,
      title: isCEO ? "Board of Directors Meeting" : "Team Standup",
      time: "10:00 AM",
      date: "Today",
      attendees: isCEO ? 8 : 6,
      type: isCEO ? "Executive" : "Team",
      priority: "high",
    },
    {
      id: 2,
      title: isCEO ? "Medical Staff Review" : "Project Review",
      time: "2:30 PM",
      date: "Today",
      attendees: isCEO ? 12 : 4,
      type: isCEO ? "Clinical" : "Work",
      priority: "medium",
    },
    {
      id: 3,
      title: isCEO ? "Budget Planning Session" : "Training Session",
      time: "9:00 AM",
      date: "Tomorrow",
      attendees: isCEO ? 6 : 8,
      type: isCEO ? "Financial" : "Development",
      priority: "high",
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="healthcare-card p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {user.username.split(" ")[0]}!
              </h1>
              <p className="text-blue-100 text-lg mb-2">
                {isCEO
                  ? "Healthcare Management Dashboard - Executive Overview"
                  : `${user.department} Department Dashboard`}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">Real-time Monitoring</span>
                </div>
                {!isCEO && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span className="text-sm">Performance Tracked</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Stethoscope className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="healthcare-card hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mb-3">{stat.description}</p>
                    <div className="flex items-center">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : stat.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      ) : (
                        <Activity className="h-4 w-4 text-blue-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                              ? "text-red-600"
                              : "text-blue-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        {isCEO && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue vs Expenses Chart */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Revenue vs Expenses</span>
                </CardTitle>
                <CardDescription>Monthly financial performance (6 months)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, ""]} />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Staff Distribution</span>
                </CardTitle>
                <CardDescription>Employee distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>{isCEO ? "Recent Financial Activities" : "My Recent Activities"}</span>
              </CardTitle>
              <CardDescription>
                {isCEO ? "Latest healthcare financial transactions" : "Your recent work activities"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(isCEO
                  ? recentTransactions
                  : [
                      {
                        id: 1,
                        type: "Task",
                        amount: "Completed",
                        client: "Patient Data Analysis",
                        date: "2024-01-15",
                        category: "Analysis",
                      },
                      {
                        id: 2,
                        type: "Meeting",
                        amount: "Attended",
                        client: "Team Standup",
                        date: "2024-01-14",
                        category: "Collaboration",
                      },
                      {
                        id: 3,
                        type: "Training",
                        amount: "Completed",
                        client: "HIPAA Compliance",
                        date: "2024-01-13",
                        category: "Development",
                      },
                      {
                        id: 4,
                        type: "Task",
                        amount: "In Progress",
                        client: "System Integration",
                        date: "2024-01-12",
                        category: "Development",
                      },
                    ]
                ).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{activity.client}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={activity.type === "Revenue" || activity.type === "Task" ? "default" : "secondary"}
                        className={
                          activity.type === "Revenue" || activity.amount === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : ""
                        }
                      >
                        {activity.type}
                      </Badge>
                      <p className="font-bold mt-1 text-sm text-muted-foreground">{activity.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Upcoming Meetings</span>
              </CardTitle>
              <CardDescription>
                {isCEO ? "Scheduled healthcare management meetings" : "Your scheduled meetings and events"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-full ${
                          meeting.priority === "high"
                            ? "bg-red-100 dark:bg-red-900/20"
                            : "bg-blue-100 dark:bg-blue-900/20"
                        }`}
                      >
                        {meeting.priority === "high" ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {meeting.date} at {meeting.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {meeting.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{meeting.attendees} attendees</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>{isCEO ? "Healthcare Performance Metrics" : "My Performance Metrics"}</span>
            </CardTitle>
            <CardDescription>
              {isCEO ? "Key performance indicators for healthcare operations" : "Your individual performance tracking"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(isCEO
                ? performanceData
                : [
                    { metric: "Task Completion", current: 92, target: 90 },
                    { metric: "Quality Score", current: 88, target: 85 },
                    { metric: "Team Collaboration", current: 95, target: 90 },
                    { metric: "Learning Progress", current: 78, target: 80 },
                  ]
              ).map((metric, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{metric.metric}</span>
                    <span className="text-sm font-bold text-foreground">{metric.current}%</span>
                  </div>
                  <Progress value={metric.current} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current: {metric.current}%</span>
                    <span>Target: {metric.target}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
