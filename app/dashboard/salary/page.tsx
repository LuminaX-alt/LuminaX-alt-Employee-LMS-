"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, DollarSign, TrendingUp, Users, Calendar, MoreHorizontal, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db, type Employee, type SalaryHistory } from "@/lib/database"

interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  baseSalary: number
  overtime: number
  bonuses: number
  deductions: number
  netPay: number
  payPeriod: string
  payDate: string
  status: "Processed" | "Pending" | "Hold"
  department: string
}

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "PR001",
    employeeId: "1",
    employeeName: "Dev Sharma",
    baseSalary: 20833.33, // Monthly salary
    overtime: 0,
    bonuses: 5000,
    deductions: 3125, // Taxes, insurance, etc.
    netPay: 22708.33,
    payPeriod: "January 2024",
    payDate: "2024-01-31",
    status: "Processed",
    department: "Executive",
  },
  {
    id: "PR002",
    employeeId: "2",
    employeeName: "Sarah Johnson",
    baseSalary: 15000,
    overtime: 0,
    bonuses: 2000,
    deductions: 2550,
    netPay: 14450,
    payPeriod: "January 2024",
    payDate: "2024-01-31",
    status: "Processed",
    department: "Finance",
  },
  {
    id: "PR003",
    employeeId: "3",
    employeeName: "Michael Chen",
    baseSalary: 15833.33,
    overtime: 500,
    bonuses: 1500,
    deductions: 2650,
    netPay: 15183.33,
    payPeriod: "January 2024",
    payDate: "2024-01-31",
    status: "Processed",
    department: "Technology",
  },
  {
    id: "PR004",
    employeeId: "4",
    employeeName: "Emily Rodriguez",
    baseSalary: 10000,
    overtime: 200,
    bonuses: 800,
    deductions: 1650,
    netPay: 9350,
    payPeriod: "January 2024",
    payDate: "2024-01-31",
    status: "Processed",
    department: "Human Resources",
  },
  {
    id: "PR005",
    employeeId: "5",
    employeeName: "David Kim",
    baseSalary: 9166.67,
    overtime: 300,
    bonuses: 500,
    deductions: 1450,
    netPay: 8516.67,
    payPeriod: "January 2024",
    payDate: "2024-01-31",
    status: "Hold",
    department: "Technology",
  },
]

export default function SalaryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords)
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"payroll" | "salaries" | "history">("payroll")
  const [isProcessPayrollOpen, setIsProcessPayrollOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
    loadData()
  }, [router])

  const loadData = () => {
    setEmployees(db.getAllEmployees())
    setSalaryHistory(db.getSalaryHistory())
  }

  const filteredPayroll = payrollRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Hold":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netPay, 0)
  const totalDeductions = payrollRecords.reduce((sum, record) => sum + record.deductions, 0)
  const totalBonuses = payrollRecords.reduce((sum, record) => sum + record.bonuses, 0)
  const processedCount = payrollRecords.filter((r) => r.status === "Processed").length

  // Department-wise payroll breakdown
  const departmentPayroll = employees.reduce(
    (acc, emp) => {
      const dept = emp.department
      if (!acc[dept]) {
        acc[dept] = { total: 0, count: 0, avgSalary: 0 }
      }
      acc[dept].total += emp.salary
      acc[dept].count += 1
      acc[dept].avgSalary = acc[dept].total / acc[dept].count
      return acc
    },
    {} as Record<string, { total: number; count: number; avgSalary: number }>,
  )

  if (!user) {
    return <div>Loading...</div>
  }

  const isCEO = user.role === "CEO"

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payroll Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Healthcare Team Compensation & Benefits Administration
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "payroll" ? "default" : "outline"}
              onClick={() => setActiveTab("payroll")}
              className={activeTab === "payroll" ? "healthcare-button" : ""}
            >
              Payroll
            </Button>
            <Button
              variant={activeTab === "salaries" ? "default" : "outline"}
              onClick={() => setActiveTab("salaries")}
              className={activeTab === "salaries" ? "healthcare-button" : ""}
            >
              Salaries
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "outline"}
              onClick={() => setActiveTab("history")}
              className={activeTab === "history" ? "healthcare-button" : ""}
            >
              History
            </Button>
          </div>
        </div>

        {/* Payroll Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalPayroll.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Monthly Payroll</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">${totalBonuses.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Bonuses</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Deductions</p>
                </div>
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{processedCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Processed Payments</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === "payroll" && (
          <>
            {/* Payroll Records */}
            <Card className="healthcare-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Monthly Payroll Records</CardTitle>
                    <CardDescription>Healthcare team compensation for January 2024</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search payroll..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {isCEO && (
                      <Button className="healthcare-button" onClick={() => setIsProcessPayrollOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Process Payroll
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Base Salary</TableHead>
                        <TableHead className="hidden md:table-cell">Overtime</TableHead>
                        <TableHead className="hidden lg:table-cell">Bonuses</TableHead>
                        <TableHead className="hidden lg:table-cell">Deductions</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead className="hidden xl:table-cell">Pay Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayroll.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {record.employeeName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{record.employeeName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{record.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">${record.baseSalary.toLocaleString()}</p>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <p className="font-medium">${record.overtime.toLocaleString()}</p>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <p className="font-medium text-green-600">${record.bonuses.toLocaleString()}</p>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <p className="font-medium text-red-600">${record.deductions.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-lg">${record.netPay.toLocaleString()}</p>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <p className="text-sm">{new Date(record.payDate).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Pay Stub
                                </DropdownMenuItem>
                                {isCEO && (
                                  <>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Adjust Payment</DropdownMenuItem>
                                    {record.status === "Hold" && <DropdownMenuItem>Release Payment</DropdownMenuItem>}
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "salaries" && (
          <>
            {/* Department Salary Breakdown */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle>Department Salary Analysis</CardTitle>
                <CardDescription>Healthcare team compensation by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(departmentPayroll).map(([dept, data]) => (
                    <div key={dept} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{dept}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Annual:</span>
                          <span className="font-medium">${(data.total * 12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Employees:</span>
                          <span className="font-medium">{data.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Salary:</span>
                          <span className="font-medium">${data.avgSalary.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employee Salaries */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle>Employee Salaries</CardTitle>
                <CardDescription>Current salary information for all healthcare team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Annual Salary</TableHead>
                        <TableHead>Monthly</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {employee.username
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{employee.username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{employee.designation}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{employee.department}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-lg">${employee.salary.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">${(employee.salary / 12).toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(employee.joinDate).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${employee.performanceScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{employee.performanceScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {isCEO && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Salary History</DropdownMenuItem>
                                  <DropdownMenuItem>Adjust Salary</DropdownMenuItem>
                                  <DropdownMenuItem>Performance Review</DropdownMenuItem>
                                  <DropdownMenuItem>Generate Report</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "history" && (
          <>
            {/* Salary History */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle>Salary Change History</CardTitle>
                <CardDescription>Complete audit trail of all salary adjustments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Previous Salary</TableHead>
                        <TableHead>New Salary</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Approved By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaryHistory.map((record) => {
                        const employee = employees.find((e) => e.id === record.employeeId)
                        const change = record.newSalary - record.previousSalary
                        const changePercent = ((change / record.previousSalary) * 100).toFixed(1)

                        return (
                          <TableRow key={record.id}>
                            <TableCell>
                              <p className="font-medium">{employee?.username || "Unknown"}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {employee?.designation || "N/A"}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">${record.previousSalary.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">${record.newSalary.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <span className={`font-medium ${change > 0 ? "text-green-600" : "text-red-600"}`}>
                                  {change > 0 ? "+" : ""}${change.toLocaleString()}
                                </span>
                                <span className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}>
                                  ({changePercent}%)
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{new Date(record.effectiveDate).toLocaleDateString()}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm max-w-[200px] truncate">{record.reason}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{record.approvedBy}</p>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
