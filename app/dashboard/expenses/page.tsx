"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Zap, Wifi, Shield, Building, MoreHorizontal, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

interface Expense {
  id: string
  description: string
  category: string
  amount: number
  date: string
  vendor: string
  status: "Pending" | "Approved" | "Paid" | "Rejected"
  department: string
  notes: string
  isRecurring: boolean
  nextDueDate?: string
}

const mockExpenses: Expense[] = [
  {
    id: "E001",
    description: "Data Center Electricity Bill",
    category: "Utilities",
    amount: 45000,
    date: "2024-01-15",
    vendor: "Metropolitan Electric Company",
    status: "Paid",
    department: "Technology",
    notes: "High-performance computing infrastructure power consumption for AI processing",
    isRecurring: true,
    nextDueDate: "2024-02-15",
  },
  {
    id: "E002",
    description: "AWS Cloud Computing Services",
    category: "Cloud Services",
    amount: 28500,
    date: "2024-01-14",
    vendor: "Amazon Web Services",
    status: "Paid",
    department: "Technology",
    notes: "GPU instances for medical AI model training and inference",
    isRecurring: true,
    nextDueDate: "2024-02-14",
  },
  {
    id: "E003",
    description: "Microsoft Azure AI Services",
    category: "Cloud Services",
    amount: 22000,
    date: "2024-01-13",
    vendor: "Microsoft Corporation",
    status: "Paid",
    department: "Technology",
    notes: "Cognitive Services for healthcare data processing",
    isRecurring: true,
    nextDueDate: "2024-02-13",
  },
  {
    id: "E004",
    description: "Office Building Rent",
    category: "Facilities",
    amount: 35000,
    date: "2024-01-12",
    vendor: "Healthcare Plaza Properties",
    status: "Paid",
    department: "Administration",
    notes: "Monthly rent for 15,000 sq ft healthcare facility",
    isRecurring: true,
    nextDueDate: "2024-02-12",
  },
  {
    id: "E005",
    description: "Internet & Network Infrastructure",
    category: "Telecommunications",
    amount: 8500,
    date: "2024-01-11",
    vendor: "Verizon Business",
    status: "Paid",
    department: "Technology",
    notes: "High-speed fiber internet for telemedicine and data transfer",
    isRecurring: true,
    nextDueDate: "2024-02-11",
  },
  {
    id: "E006",
    description: "Cybersecurity Software Licenses",
    category: "Security",
    amount: 15000,
    date: "2024-01-10",
    vendor: "CrowdStrike Inc.",
    status: "Approved",
    department: "Technology",
    notes: "Advanced threat protection for healthcare data security",
    isRecurring: true,
    nextDueDate: "2024-02-10",
  },
  {
    id: "E007",
    description: "HVAC System Maintenance",
    category: "Facilities",
    amount: 12000,
    date: "2024-01-09",
    vendor: "Climate Control Solutions",
    status: "Paid",
    department: "Facilities",
    notes: "Server room cooling and general facility climate control",
    isRecurring: false,
  },
  {
    id: "E008",
    description: "Software Development Tools",
    category: "Software",
    amount: 18500,
    date: "2024-01-08",
    vendor: "JetBrains s.r.o.",
    status: "Paid",
    department: "Technology",
    notes: "IDE licenses for healthcare software development team",
    isRecurring: true,
    nextDueDate: "2024-07-08",
  },
]

export default function ExpensesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    amount: "",
    vendor: "",
    department: "",
    notes: "",
    isRecurring: false,
    status: "Pending" as "Pending" | "Approved" | "Paid" | "Rejected",
  })
  const router = useRouter()

  const categories = [
    "Utilities",
    "Cloud Services",
    "Software",
    "Hardware",
    "Facilities",
    "Telecommunications",
    "Security",
    "Insurance",
    "Legal",
    "Marketing",
    "Training",
    "Travel",
    "Office Supplies",
  ]

  const departments = [
    "Technology",
    "Administration",
    "Facilities",
    "Finance",
    "Human Resources",
    "Marketing",
    "Operations",
    "Medical Affairs",
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Utilities":
        return <Zap className="h-4 w-4" />
      case "Telecommunications":
        return <Wifi className="h-4 w-4" />
      case "Security":
        return <Shield className="h-4 w-4" />
      case "Facilities":
        return <Building className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyRecurring = expenses.filter((e) => e.isRecurring).reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = expenses.filter((e) => e.status === "Pending")
  const paidExpenses = expenses.filter((e) => e.status === "Paid")

  // Budget analysis
  const monthlyBudget = 300000
  const budgetUtilization = (totalExpenses / monthlyBudget) * 100

  const expensesByCategory = categories
    .map((category) => {
      const categoryExpenses = expenses.filter((e) => e.category === category)
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
      return { category, total, count: categoryExpenses.length }
    })
    .filter((item) => item.total > 0)

  const resetForm = () => {
    setFormData({
      description: "",
      category: "",
      amount: "",
      vendor: "",
      department: "",
      notes: "",
      isRecurring: false,
      status: "Pending",
    })
  }

  const handleAddExpense = () => {
    if (!formData.description || !formData.category || !formData.amount || !formData.vendor) {
      alert("Please fill in all required fields")
      return
    }

    const newExpense: Expense = {
      id: `E${String(expenses.length + 1).padStart(3, "0")}`,
      description: formData.description,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      date: new Date().toISOString().split("T")[0],
      vendor: formData.vendor,
      status: formData.status,
      department: formData.department,
      notes: formData.notes,
      isRecurring: formData.isRecurring,
      nextDueDate: formData.isRecurring
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        : undefined,
    }

    setExpenses([...expenses, newExpense])
    setIsAddDialogOpen(false)
    resetForm()
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const isCEO = user.role === "CEO"

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Expense Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Healthcare Technology & Operational Expenses</p>
          </div>
          {isCEO && (
            <Button className="healthcare-button" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Monthly Expenses</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">${monthlyRecurring.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recurring Monthly</p>
                </div>
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingExpenses.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{paidExpenses.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paid This Month</p>
                </div>
                <Building className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Analysis */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle>Monthly Budget Analysis</CardTitle>
            <CardDescription>Healthcare operational budget utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Budget Utilization</span>
                <span className="text-sm font-bold">{budgetUtilization.toFixed(1)}%</span>
              </div>
              <Progress value={budgetUtilization} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Spent: ${totalExpenses.toLocaleString()}</span>
                <span>Budget: ${monthlyBudget.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Breakdown by expense category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expensesByCategory.map((item) => (
                <div key={item.category} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(item.category)}
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                  <p className="text-2xl font-bold">${item.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {((item.total / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Table */}
        <Card className="healthcare-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Healthcare Technology Expenses</CardTitle>
                <CardDescription>Operational costs for AI-enabled smart clinic infrastructure</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description & Details</TableHead>
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden lg:table-cell">Department</TableHead>
                    <TableHead className="hidden xl:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(expense.category)}
                            <p className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</p>
                          </div>
                          {expense.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[250px]">{expense.notes}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="font-medium">{expense.vendor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {expense.id}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-lg">${expense.amount.toLocaleString()}</p>
                        {expense.isRecurring && expense.nextDueDate && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Next: {new Date(expense.nextDueDate).toLocaleDateString()}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{expense.department}</Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <p className="text-sm">{new Date(expense.date).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {isCEO && (
                              <>
                                <DropdownMenuItem>Edit Expense</DropdownMenuItem>
                                {expense.status === "Pending" && <DropdownMenuItem>Approve</DropdownMenuItem>}
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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

        {/* Add Expense Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record a new healthcare technology or operational expense.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Data Center Electricity Bill"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="45000.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="Metropolitan Electric Company"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes & Details</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="High-performance computing infrastructure power consumption for AI processing"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isRecurring">Recurring monthly expense</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense} className="healthcare-button">
                Add Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
