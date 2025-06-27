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
import { Search, Plus, Mail, Phone, MoreHorizontal, Edit, Trash2, DollarSign, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db, type Employee } from "@/lib/database"

interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

export default function EmployeesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    designation: "",
    department: "",
    salary: "",
    phone: "",
    address: "",
    emergencyContact: "",
    status: "Active" as "Active" | "On Leave" | "Inactive",
  })
  const [salaryData, setSalaryData] = useState({
    newSalary: "",
    reason: "",
  })
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
    "Executive",
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadEmployees()
  }, [router])

  const loadEmployees = () => {
    setEmployees(db.getAllEmployees())
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      designation: "",
      department: "",
      salary: "",
      phone: "",
      address: "",
      emergencyContact: "",
      status: "Active",
    })
  }

  const handleAddEmployee = () => {
    if (!formData.username || !formData.email || !formData.designation || !formData.department || !formData.salary) {
      alert("Please fill in all required fields")
      return
    }

    db.addEmployee({
      username: formData.username,
      email: formData.email,
      designation: formData.designation,
      department: formData.department,
      salary: Number.parseInt(formData.salary),
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      status: formData.status,
      role: "Employee",
      joinDate: new Date().toISOString().split("T")[0],
      performanceScore: 75,
    })

    loadEmployees()
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditEmployee = () => {
    if (!selectedEmployee) return

    db.updateEmployee(selectedEmployee.id, {
      username: formData.username,
      email: formData.email,
      designation: formData.designation,
      department: formData.department,
      salary: Number.parseInt(formData.salary),
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      status: formData.status,
    })

    loadEmployees()
    setIsEditDialogOpen(false)
    setSelectedEmployee(null)
    resetForm()
  }

  const handleDeleteEmployee = (employee: Employee) => {
    if (employee.role === "CEO") {
      alert("Cannot delete CEO account")
      return
    }

    db.deleteEmployee(employee.id)
    loadEmployees()
  }

  const handleUpdateSalary = () => {
    if (!selectedEmployee || !salaryData.newSalary || !salaryData.reason) {
      alert("Please fill in all salary fields")
      return
    }

    db.updateSalary(
      selectedEmployee.id,
      Number.parseInt(salaryData.newSalary),
      salaryData.reason,
      user?.username || "System",
    )

    loadEmployees()
    setIsSalaryDialogOpen(false)
    setSalaryData({ newSalary: "", reason: "" })
    setSelectedEmployee(null)
  }

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      username: employee.username,
      email: employee.email,
      designation: employee.designation,
      department: employee.department,
      salary: employee.salary.toString(),
      phone: employee.phone,
      address: employee.address,
      emergencyContact: employee.emergencyContact,
      status: employee.status,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewDialogOpen(true)
  }

  const openSalaryDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setSalaryData({ newSalary: employee.salary.toString(), reason: "" })
    setIsSalaryDialogOpen(true)
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Employee Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all employees and their information</p>
          </div>
          {isCEO && (
            <Button className="healthcare-button" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{employees.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter((e) => e.status === "Active").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {employees.filter((e) => e.status === "On Leave").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">On Leave</p>
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{new Set(employees.map((e) => e.department)).size}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Table */}
        <Card className="healthcare-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Employees</CardTitle>
                <CardDescription>Complete list of company employees</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees..."
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
                    <TableHead>Employee</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden lg:table-cell">Department</TableHead>
                    <TableHead className="hidden sm:table-cell">Salary</TableHead>
                    <TableHead className="hidden xl:table-cell">Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {employee.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[150px]">{employee.email}</span>
                          </div>
                          {employee.phone && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="h-3 w-3 mr-1" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{employee.designation}</p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{employee.department}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="font-medium">${employee.salary.toLocaleString()}</p>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <p className="text-sm">{new Date(employee.joinDate).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewDialog(employee)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {isCEO && (
                              <>
                                <DropdownMenuItem onClick={() => openEditDialog(employee)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Employee
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openSalaryDialog(employee)}>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Update Salary
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {employee.role !== "CEO" && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Employee
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete {employee.username}
                                          's account and remove all associated data.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteEmployee(employee)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
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

        {/* Add Employee Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter the details for the new employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Full Name *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@luminax-alt.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Job Title *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
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
                  <Label htmlFor="salary">Annual Salary *</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="60000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} className="healthcare-button">
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>Update the employee details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Full Name *</Label>
                  <Input
                    id="edit-username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-designation">Job Title *</Label>
                  <Input
                    id="edit-designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="edit-salary">Annual Salary *</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "Active" | "On Leave" | "Inactive") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
                <Input
                  id="edit-emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEmployee} className="healthcare-button">
                Update Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Employee Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedEmployee.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEmployee.username}</h3>
                    <p className="text-muted-foreground">{selectedEmployee.designation}</p>
                    <Badge className={getStatusColor(selectedEmployee.status)}>{selectedEmployee.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Email</p>
                    <p>{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Department</p>
                    <p>{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Salary</p>
                    <p>${selectedEmployee.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Join Date</p>
                    <p>{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                  </div>
                  {selectedEmployee.phone && (
                    <div>
                      <p className="font-medium text-muted-foreground">Phone</p>
                      <p>{selectedEmployee.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-muted-foreground">Performance</p>
                    <p>{selectedEmployee.performanceScore}%</p>
                  </div>
                </div>
                {selectedEmployee.address && (
                  <div>
                    <p className="font-medium text-muted-foreground">Address</p>
                    <p className="text-sm">{selectedEmployee.address}</p>
                  </div>
                )}
                {selectedEmployee.emergencyContact && (
                  <div>
                    <p className="font-medium text-muted-foreground">Emergency Contact</p>
                    <p className="text-sm">{selectedEmployee.emergencyContact}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Salary Update Dialog */}
        <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Salary</DialogTitle>
              <DialogDescription>Update salary for {selectedEmployee?.username}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-salary">Current Salary</Label>
                <Input id="current-salary" value={`$${selectedEmployee?.salary.toLocaleString()}`} disabled />
              </div>
              <div>
                <Label htmlFor="new-salary">New Salary *</Label>
                <Input
                  id="new-salary"
                  type="number"
                  value={salaryData.newSalary}
                  onChange={(e) => setSalaryData({ ...salaryData, newSalary: e.target.value })}
                  placeholder="75000"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason for Change *</Label>
                <Input
                  id="reason"
                  value={salaryData.reason}
                  onChange={(e) => setSalaryData({ ...salaryData, reason: e.target.value })}
                  placeholder="Annual review, promotion, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSalaryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSalary} className="healthcare-button">
                Update Salary
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
