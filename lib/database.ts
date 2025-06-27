export interface Employee {
  id: string
  username: string
  email: string
  designation: string
  department: string
  salary: number
  joinDate: string
  status: "Active" | "On Leave" | "Inactive"
  role: "CEO" | "Employee"
  phone: string
  address: string
  emergencyContact: string
  performanceScore: number
}

export interface SalaryHistory {
  id: string
  employeeId: string
  previousSalary: number
  newSalary: number
  effectiveDate: string
  reason: string
  approvedBy: string
}

export interface Transaction {
  id: string
  type: "Revenue" | "Expense" | "Payroll"
  amount: number
  description: string
  date: string
  category: string
  status: "Completed" | "Pending" | "Processing"
}

export interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  attendees: string[]
  location: string
  type: "In-Person" | "Virtual" | "Hybrid"
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  organizer: string
}

class Database {
  private employees: Employee[] = []
  private salaryHistory: SalaryHistory[] = []
  private transactions: Transaction[] = []
  private meetings: Meeting[] = []

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultData()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const employees = localStorage.getItem("luminax_employees")
      const salaryHistory = localStorage.getItem("luminax_salary_history")
      const transactions = localStorage.getItem("luminax_transactions")
      const meetings = localStorage.getItem("luminax_meetings")

      if (employees) this.employees = JSON.parse(employees)
      if (salaryHistory) this.salaryHistory = JSON.parse(salaryHistory)
      if (transactions) this.transactions = JSON.parse(transactions)
      if (meetings) this.meetings = JSON.parse(meetings)
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("luminax_employees", JSON.stringify(this.employees))
      localStorage.setItem("luminax_salary_history", JSON.stringify(this.salaryHistory))
      localStorage.setItem("luminax_transactions", JSON.stringify(this.transactions))
      localStorage.setItem("luminax_meetings", JSON.stringify(this.meetings))
    }
  }

  private initializeDefaultData() {
    if (this.employees.length === 0) {
      this.employees = [
        {
          id: "1",
          username: "Dev Sharma",
          email: "dev.sharma@luminax-alt.com",
          designation: "CEO",
          department: "Executive",
          salary: 250000,
          joinDate: "2020-01-15",
          status: "Active",
          role: "CEO",
          phone: "+1 (555) 123-4567",
          address: "123 Healthcare Ave, Medical City, MC 12345",
          emergencyContact: "+1 (555) 987-6543",
          performanceScore: 98,
        },
        {
          id: "2",
          username: "Sarah Johnson",
          email: "sarah.johnson@luminax-alt.com",
          designation: "CFO",
          department: "Finance",
          salary: 180000,
          joinDate: "2020-03-20",
          status: "Active",
          role: "Employee",
          phone: "+1 (555) 234-5678",
          address: "456 Finance St, Business District, BD 23456",
          emergencyContact: "+1 (555) 876-5432",
          performanceScore: 95,
        },
        {
          id: "3",
          username: "Michael Chen",
          email: "michael.chen@luminax-alt.com",
          designation: "CTO",
          department: "Technology",
          salary: 190000,
          joinDate: "2020-05-10",
          status: "Active",
          role: "Employee",
          phone: "+1 (555) 345-6789",
          address: "789 Tech Blvd, Innovation Park, IP 34567",
          emergencyContact: "+1 (555) 765-4321",
          performanceScore: 97,
        },
        {
          id: "4",
          username: "Emily Rodriguez",
          email: "emily.rodriguez@luminax-alt.com",
          designation: "HR Manager",
          department: "Human Resources",
          salary: 120000,
          joinDate: "2021-02-14",
          status: "Active",
          role: "Employee",
          phone: "+1 (555) 456-7890",
          address: "321 HR Lane, Corporate Center, CC 45678",
          emergencyContact: "+1 (555) 654-3210",
          performanceScore: 92,
        },
        {
          id: "5",
          username: "David Kim",
          email: "david.kim@luminax-alt.com",
          designation: "Senior Developer",
          department: "Technology",
          salary: 110000,
          joinDate: "2021-06-01",
          status: "On Leave",
          role: "Employee",
          phone: "+1 (555) 567-8901",
          address: "654 Developer Dr, Code Valley, CV 56789",
          emergencyContact: "+1 (555) 543-2109",
          performanceScore: 89,
        },
      ]

      this.transactions = [
        {
          id: "T001",
          type: "Revenue",
          amount: 45000,
          description: "MedTech Solutions - Equipment Sale",
          date: "2024-01-15",
          category: "Equipment Sale",
          status: "Completed",
        },
        {
          id: "T002",
          type: "Expense",
          amount: 8200,
          description: "Medical Supplies Co. - Inventory",
          date: "2024-01-14",
          category: "Inventory",
          status: "Completed",
        },
        {
          id: "T003",
          type: "Payroll",
          amount: 125000,
          description: "Monthly Staff Payroll",
          date: "2024-01-13",
          category: "Salaries",
          status: "Completed",
        },
      ]

      this.meetings = [
        {
          id: "M001",
          title: "Weekly Board Meeting",
          description: "Review quarterly performance and strategic planning",
          date: "2024-01-16",
          time: "10:00",
          duration: 120,
          attendees: ["Dev Sharma", "Sarah Johnson", "Michael Chen", "Emily Rodriguez"],
          location: "Conference Room A",
          type: "In-Person",
          status: "Scheduled",
          organizer: "Dev Sharma",
        },
        {
          id: "M002",
          title: "Financial Review Meeting",
          description: "Monthly financial performance analysis",
          date: "2024-01-16",
          time: "14:30",
          duration: 90,
          attendees: ["Dev Sharma", "Sarah Johnson"],
          location: "Zoom Meeting",
          type: "Virtual",
          status: "Scheduled",
          organizer: "Sarah Johnson",
        },
      ]

      this.saveToStorage()
    }
  }

  // Employee Management
  getAllEmployees(): Employee[] {
    return this.employees
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((emp) => emp.id === id)
  }

  addEmployee(employee: Omit<Employee, "id">): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    }
    this.employees.push(newEmployee)
    this.saveToStorage()
    return newEmployee
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex((emp) => emp.id === id)
    if (index === -1) return null

    this.employees[index] = { ...this.employees[index], ...updates }
    this.saveToStorage()
    return this.employees[index]
  }

  deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex((emp) => emp.id === id)
    if (index === -1) return false

    this.employees.splice(index, 1)
    this.saveToStorage()
    return true
  }

  // Salary Management
  updateSalary(employeeId: string, newSalary: number, reason: string, approvedBy: string): boolean {
    const employee = this.getEmployeeById(employeeId)
    if (!employee) return false

    const salaryRecord: SalaryHistory = {
      id: Date.now().toString(),
      employeeId,
      previousSalary: employee.salary,
      newSalary,
      effectiveDate: new Date().toISOString().split("T")[0],
      reason,
      approvedBy,
    }

    this.salaryHistory.push(salaryRecord)
    this.updateEmployee(employeeId, { salary: newSalary })
    return true
  }

  getSalaryHistory(employeeId?: string): SalaryHistory[] {
    if (employeeId) {
      return this.salaryHistory.filter((record) => record.employeeId === employeeId)
    }
    return this.salaryHistory
  }

  // Transaction Management
  getAllTransactions(): Transaction[] {
    return this.transactions
  }

  addTransaction(transaction: Omit<Transaction, "id">): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: `T${Date.now()}`,
    }
    this.transactions.push(newTransaction)
    this.saveToStorage()
    return newTransaction
  }

  // Meeting Management
  getAllMeetings(): Meeting[] {
    return this.meetings
  }

  addMeeting(meeting: Omit<Meeting, "id">): Meeting {
    const newMeeting: Meeting = {
      ...meeting,
      id: `M${Date.now()}`,
    }
    this.meetings.push(newMeeting)
    this.saveToStorage()
    return newMeeting
  }

  updateMeeting(id: string, updates: Partial<Meeting>): Meeting | null {
    const index = this.meetings.findIndex((meeting) => meeting.id === id)
    if (index === -1) return null

    this.meetings[index] = { ...this.meetings[index], ...updates }
    this.saveToStorage()
    return this.meetings[index]
  }

  deleteMeeting(id: string): boolean {
    const index = this.meetings.findIndex((meeting) => meeting.id === id)
    if (index === -1) return false

    this.meetings.splice(index, 1)
    this.saveToStorage()
    return true
  }

  // Authentication
  authenticateUser(username: string, password: string): Employee | null {
    // CEO authentication
    if (username === "Dev Sharma" && password === "Dec@0412") {
      return this.employees.find((emp) => emp.role === "CEO") || null
    }

    // Employee authentication
    const employee = this.employees.find((emp) => emp.username === username && emp.role === "Employee")
    if (employee) {
      const storedPassword = localStorage.getItem(`password_${employee.id}`)
      if (storedPassword === password) {
        return employee
      }
    }

    return null
  }

  registerEmployee(data: {
    username: string
    email: string
    password: string
    department: string
    designation: string
  }): boolean {
    const newEmployee = this.addEmployee({
      username: data.username,
      email: data.email,
      designation: data.designation,
      department: data.department,
      salary: 60000, // Default starting salary
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
      role: "Employee",
      phone: "",
      address: "",
      emergencyContact: "",
      performanceScore: 75,
    })

    // Store password (in production, hash this)
    localStorage.setItem(`password_${newEmployee.id}`, data.password)
    return true
  }
}

export const db = new Database()
