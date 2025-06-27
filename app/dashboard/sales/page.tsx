"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Target, Calendar, Plus } from "lucide-react"

interface User {
  username: string
  designation: string
  id: string
}

interface Sale {
  id: string
  client: string
  amount: number
  date: string
  status: "Completed" | "Pending" | "Processing"
  product: string
  salesperson: string
}

const mockSales: Sale[] = [
  {
    id: "S001",
    client: "MedTech Solutions",
    amount: 45000,
    date: "2024-01-15",
    status: "Completed",
    product: "Surgical Equipment Package",
    salesperson: "Lisa Thompson",
  },
  {
    id: "S002",
    client: "Healthcare Corp",
    amount: 28500,
    date: "2024-01-14",
    status: "Completed",
    product: "Medical Imaging System",
    salesperson: "David Kim",
  },
  {
    id: "S003",
    client: "City General Hospital",
    amount: 67000,
    date: "2024-01-13",
    status: "Processing",
    product: "Complete OR Setup",
    salesperson: "Lisa Thompson",
  },
  {
    id: "S004",
    client: "Regional Medical Center",
    amount: 15000,
    date: "2024-01-12",
    status: "Pending",
    product: "Diagnostic Tools",
    salesperson: "Michael Chen",
  },
  {
    id: "S005",
    client: "Wellness Clinic Network",
    amount: 32000,
    date: "2024-01-11",
    status: "Completed",
    product: "Patient Monitoring System",
    salesperson: "David Kim",
  },
]

export default function SalesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const completedSales = sales.filter((sale) => sale.status === "Completed")
  const pendingSales = sales.filter((sale) => sale.status === "Pending")
  const monthlyTarget = 500000
  const achievementPercentage = (totalRevenue / monthlyTarget) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales & Revenue</h1>
            <p className="text-gray-600 mt-2">Track sales performance and revenue metrics</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Sale
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{completedSales.length}</p>
                  <p className="text-sm text-gray-600">Completed Sales</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{pendingSales.length}</p>
                  <p className="text-sm text-gray-600">Pending Sales</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(achievementPercentage)}%</p>
                  <p className="text-sm text-gray-600">Target Achievement</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Target Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Target</CardTitle>
            <CardDescription>Progress towards monthly revenue goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current: ${totalRevenue.toLocaleString()}</span>
                <span className="text-sm font-medium">Target: ${monthlyTarget.toLocaleString()}</span>
              </div>
              <Progress value={achievementPercentage} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{Math.round(achievementPercentage)}% achieved</span>
                <span>${(monthlyTarget - totalRevenue).toLocaleString()} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest sales transactions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Salesperson</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.client}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>{sale.salesperson}</TableCell>
                    <TableCell className="font-bold text-green-600">${sale.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales by Salesperson */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance by Team Member</CardTitle>
            <CardDescription>Individual sales performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Lisa Thompson", "David Kim", "Michael Chen"].map((person) => {
                const personSales = sales.filter((sale) => sale.salesperson === person)
                const personRevenue = personSales.reduce((sum, sale) => sum + sale.amount, 0)
                const personTarget = 150000
                const personAchievement = (personRevenue / personTarget) * 100

                return (
                  <div key={person} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{person}</h3>
                      <span className="text-sm text-gray-600">
                        ${personRevenue.toLocaleString()} / ${personTarget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={personAchievement} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{personSales.length} sales</span>
                      <span>{Math.round(personAchievement)}% of target</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
