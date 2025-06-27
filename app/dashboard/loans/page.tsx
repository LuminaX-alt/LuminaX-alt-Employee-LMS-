"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, DollarSign, TrendingUp, Calendar, Building, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

interface Loan {
  id: string
  loanType: string
  lender: string
  principalAmount: number
  currentBalance: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  startDate: string
  maturityDate: string
  status: "Active" | "Paid Off" | "Defaulted" | "Pending"
  purpose: string
  collateral?: string
  paymentHistory: PaymentRecord[]
}

interface PaymentRecord {
  date: string
  amount: number
  principal: number
  interest: number
  balance: number
}

interface Investment {
  id: string
  investorName: string
  investmentType: string
  amount: number
  equity: number
  investmentDate: string
  status: "Active" | "Exited" | "Pending"
  valuation: number
  returns: number
}

const mockLoans: Loan[] = [
  {
    id: "L001",
    loanType: "Equipment Financing",
    lender: "Healthcare Capital Partners",
    principalAmount: 2500000,
    currentBalance: 1875000,
    interestRate: 4.5,
    termMonths: 60,
    monthlyPayment: 46500,
    startDate: "2022-01-15",
    maturityDate: "2027-01-15",
    status: "Active",
    purpose: "AI Medical Imaging Equipment & GPU Infrastructure",
    collateral: "Medical Equipment & Technology Assets",
    paymentHistory: [
      { date: "2024-01-15", amount: 46500, principal: 39500, interest: 7000, balance: 1875000 },
      { date: "2023-12-15", amount: 46500, principal: 39350, interest: 7150, balance: 1914500 },
      { date: "2023-11-15", amount: 46500, principal: 39200, interest: 7300, balance: 1953850 },
    ],
  },
  {
    id: "L002",
    loanType: "Working Capital Loan",
    lender: "First National Bank",
    principalAmount: 1000000,
    currentBalance: 650000,
    interestRate: 6.25,
    termMonths: 36,
    monthlyPayment: 30500,
    startDate: "2023-06-01",
    maturityDate: "2026-06-01",
    status: "Active",
    purpose: "Software Development & Cloud Infrastructure",
    paymentHistory: [
      { date: "2024-01-01", amount: 30500, principal: 27125, interest: 3375, balance: 650000 },
      { date: "2023-12-01", amount: 30500, principal: 26985, interest: 3515, balance: 677125 },
    ],
  },
  {
    id: "L003",
    loanType: "SBA Loan",
    lender: "Small Business Administration",
    principalAmount: 500000,
    currentBalance: 0,
    interestRate: 3.75,
    termMonths: 84,
    monthlyPayment: 7200,
    startDate: "2017-03-01",
    maturityDate: "2024-03-01",
    status: "Paid Off",
    purpose: "Initial Healthcare Technology Setup",
    paymentHistory: [],
  },
]

const mockInvestments: Investment[] = [
  {
    id: "I001",
    investorName: "HealthTech Ventures",
    investmentType: "Series A",
    amount: 5000000,
    equity: 15,
    investmentDate: "2021-09-15",
    status: "Active",
    valuation: 33333333,
    returns: 0,
  },
  {
    id: "I002",
    investorName: "Medical Innovation Fund",
    investmentType: "Series B",
    amount: 12000000,
    equity: 20,
    investmentDate: "2023-03-20",
    status: "Active",
    valuation: 60000000,
    returns: 0,
  },
  {
    id: "I003",
    investorName: "AI Healthcare Partners",
    investmentType: "Strategic Investment",
    amount: 8000000,
    equity: 10,
    investmentDate: "2023-11-10",
    status: "Active",
    valuation: 80000000,
    returns: 0,
  },
]

const cashFlowData = [
  { month: "Jan", inflow: 450000, outflow: 380000, net: 70000 },
  { month: "Feb", inflow: 520000, outflow: 420000, net: 100000 },
  { month: "Mar", inflow: 480000, outflow: 390000, net: 90000 },
  { month: "Apr", inflow: 610000, outflow: 450000, net: 160000 },
  { month: "May", inflow: 580000, outflow: 430000, net: 150000 },
  { month: "Jun", inflow: 650000, outflow: 480000, net: 170000 },
]

const debtEquityData = [
  { name: "Debt", value: 2525000, color: "#EF4444" },
  { name: "Equity", value: 25000000, color: "#10B981" },
  { name: "Retained Earnings", value: 8500000, color: "#3B82F6" },
]

export default function LoansPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"loans" | "investments" | "analytics">("loans")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const filteredLoans = loans.filter(
    (loan) =>
      loan.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Paid Off":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Defaulted":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const totalDebt = loans.filter((l) => l.status === "Active").reduce((sum, loan) => sum + loan.currentBalance, 0)
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const monthlyPayments = loans.filter((l) => l.status === "Active").reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  const totalEquity = investments.reduce((sum, inv) => sum + inv.equity, 0)

  if (!user) {
    return <div>Loading...</div>
  }

  const isCEO = user.role === "CEO"

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Loans & Finance</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Healthcare Technology Financing & Investment Management
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "loans" ? "default" : "outline"}
              onClick={() => setActiveTab("loans")}
              className={activeTab === "loans" ? "healthcare-button" : ""}
            >
              Loans
            </Button>
            <Button
              variant={activeTab === "investments" ? "default" : "outline"}
              onClick={() => setActiveTab("investments")}
              className={activeTab === "investments" ? "healthcare-button" : ""}
            >
              Investments
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "outline"}
              onClick={() => setActiveTab("analytics")}
              className={activeTab === "analytics" ? "healthcare-button" : ""}
            >
              Analytics
            </Button>
          </div>
        </div>

        {/* Financial Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">${totalDebt.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Outstanding Debt</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">${totalInvestment.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Investment Raised</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">${monthlyPayments.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Debt Service</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{totalEquity.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Equity Given</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === "loans" && (
          <>
            {/* Loans Table */}
            <Card className="healthcare-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Healthcare Technology Loans</CardTitle>
                    <CardDescription>Equipment financing and working capital for AI-enabled healthcare</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search loans..."
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
                        <TableHead>Loan Details</TableHead>
                        <TableHead className="hidden md:table-cell">Lender</TableHead>
                        <TableHead>Amount & Balance</TableHead>
                        <TableHead className="hidden lg:table-cell">Terms</TableHead>
                        <TableHead>Monthly Payment</TableHead>
                        <TableHead className="hidden xl:table-cell">Maturity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{loan.loanType}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">{loan.purpose}</p>
                              {loan.collateral && (
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                  Collateral: {loan.collateral}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <p className="font-medium">{loan.lender}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {loan.id}</p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-bold text-lg">${loan.principalAmount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Balance: ${loan.currentBalance.toLocaleString()}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${((loan.principalAmount - loan.currentBalance) / loan.principalAmount) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{loan.interestRate}% APR</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{loan.termMonths} months</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold">${loan.monthlyPayment.toLocaleString()}</p>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <p className="text-sm">{new Date(loan.maturityDate).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Payment History</DropdownMenuItem>
                                <DropdownMenuItem>Download Statements</DropdownMenuItem>
                                {isCEO && (
                                  <>
                                    <DropdownMenuItem>Modify Terms</DropdownMenuItem>
                                    <DropdownMenuItem>Make Payment</DropdownMenuItem>
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

        {activeTab === "investments" && (
          <>
            {/* Investments Table */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle>Healthcare Technology Investments</CardTitle>
                <CardDescription>Venture capital and strategic investments in AI healthcare innovation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Investor</TableHead>
                        <TableHead>Investment Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Equity %</TableHead>
                        <TableHead>Valuation</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investments.map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{investment.investorName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {investment.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{investment.investmentType}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-lg">${investment.amount.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{investment.equity}%</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">${investment.valuation.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(investment.investmentDate).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Agreement</DropdownMenuItem>
                                <DropdownMenuItem>Investor Relations</DropdownMenuItem>
                                {isCEO && (
                                  <>
                                    <DropdownMenuItem>Send Updates</DropdownMenuItem>
                                    <DropdownMenuItem>Board Materials</DropdownMenuItem>
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

        {activeTab === "analytics" && (
          <>
            {/* Financial Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Flow Chart */}
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle>Monthly Cash Flow</CardTitle>
                  <CardDescription>Healthcare revenue vs operational expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, ""]} />
                      <Line type="monotone" dataKey="inflow" stroke="#10B981" strokeWidth={3} name="Inflow" />
                      <Line type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={3} name="Outflow" />
                      <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={3} name="Net Cash Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Debt vs Equity Chart */}
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle>Capital Structure</CardTitle>
                  <CardDescription>Debt vs equity financing breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={debtEquityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: $${(value / 1000000).toFixed(1)}M`}
                      >
                        {debtEquityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, ""]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Financial Ratios */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle>Key Financial Ratios</CardTitle>
                <CardDescription>Healthcare technology company financial health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Debt-to-Equity Ratio</p>
                    <p className="text-2xl font-bold">0.10</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Current Ratio</p>
                    <p className="text-2xl font-bold">2.8</p>
                    <p className="text-xs text-green-600">Strong Liquidity</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Interest Coverage</p>
                    <p className="text-2xl font-bold">12.5x</p>
                    <p className="text-xs text-green-600">Very Safe</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold">18.5%</p>
                    <p className="text-xs text-green-600">High Performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
