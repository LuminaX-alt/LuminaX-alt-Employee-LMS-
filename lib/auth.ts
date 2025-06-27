import { db } from "./database"

export interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

export interface RegistrationData {
  username: string
  email: string
  password: string
  department: string
  designation: string
}

// Company registration token
export const COMPANY_TOKEN = "77,777,7777"

export const authenticateUser = (username: string, password: string): User | null => {
  return db.authenticateUser(username, password)
}

export const registerEmployee = (data: RegistrationData, token: string): boolean => {
  if (token !== COMPANY_TOKEN) {
    return false
  }

  return db.registerEmployee(data)
}

export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Good Morning"
  } else if (hour < 17) {
    return "Good Afternoon"
  } else {
    return "Good Evening"
  }
}
