"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Monitor, Cpu, HardDrive, Zap, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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

interface User {
  id: string
  username: string
  email: string
  designation: string
  role: "CEO" | "Employee"
  department: string
  joinDate: string
}

interface Purchase {
  id: string
  itemName: string
  category: string
  vendor: string
  quantity: number
  unitPrice: number
  totalAmount: number
  purchaseDate: string
  status: "Pending" | "Approved" | "Delivered" | "Cancelled"
  specifications: string
  purpose: string
  requestedBy: string
  approvedBy?: string
}

const mockPurchases: Purchase[] = [
  {
    id: "P001",
    itemName: "NVIDIA RTX 4090 GPU",
    category: "Hardware",
    vendor: "NVIDIA Corporation",
    quantity: 8,
    unitPrice: 1599,
    totalAmount: 12792,
    purchaseDate: "2024-01-15",
    status: "Delivered",
    specifications: "24GB GDDR6X, 16384 CUDA Cores, 450W TDP, PCIe 4.0",
    purpose: "AI Medical Imaging Processing & Deep Learning Models",
    requestedBy: "Michael Chen",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P002",
    itemName: "Intel Xeon Platinum 8380",
    category: "Hardware",
    vendor: "Intel Corporation",
    quantity: 4,
    unitPrice: 8099,
    totalAmount: 32396,
    purchaseDate: "2024-01-14",
    status: "Delivered",
    specifications: "40 Cores, 80 Threads, 2.3GHz Base, 270W TDP",
    purpose: "High-Performance Computing for Healthcare Analytics",
    requestedBy: "Michael Chen",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P003",
    itemName: "Samsung 980 PRO SSD",
    category: "Storage",
    vendor: "Samsung Electronics",
    quantity: 16,
    unitPrice: 899,
    totalAmount: 14384,
    purchaseDate: "2024-01-13",
    status: "Delivered",
    specifications: "4TB NVMe M.2, PCIe 4.0, 7000MB/s Read Speed",
    purpose: "High-Speed Storage for Medical Data & AI Models",
    requestedBy: "David Kim",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P004",
    itemName: "Epic Systems EHR License",
    category: "Software",
    vendor: "Epic Systems Corporation",
    quantity: 1,
    unitPrice: 125000,
    totalAmount: 125000,
    purchaseDate: "2024-01-12",
    status: "Approved",
    specifications: "Enterprise Healthcare Management System, 500 User License",
    purpose: "Electronic Health Records Management",
    requestedBy: "Emily Rodriguez",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P005",
    itemName: "MATLAB Medical Imaging Toolbox",
    category: "Software",
    vendor: "MathWorks Inc.",
    quantity: 25,
    unitPrice: 2150,
    totalAmount: 53750,
    purchaseDate: "2024-01-11",
    status: "Delivered",
    specifications: "Advanced Medical Image Processing, AI/ML Integration",
    purpose: "Medical Image Analysis & Algorithm Development",
    requestedBy: "Michael Chen",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P006",
    itemName: "TensorFlow Enterprise License",
    category: "Software",
    vendor: "Google Cloud",
    quantity: 1,
    unitPrice: 45000,
    totalAmount: 45000,
    purchaseDate: "2024-01-10",
    status: "Delivered",
    specifications: "Enterprise AI/ML Platform, Healthcare Compliance",
    purpose: "AI Model Development & Deployment",
    requestedBy: "David Kim",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P007",
    itemName: "Dell PowerEdge R750 Server",
    category: "Hardware",
    vendor: "Dell Technologies",
    quantity: 2,
    unitPrice: 15999,
    totalAmount: 31998,
    purchaseDate: "2024-01-09",
    status: "Delivered",
    specifications: "2x Intel Xeon Gold, 256GB RAM, Redundant PSU",
    purpose: "Healthcare Data Processing & Storage Infrastructure",
    requestedBy: "Michael Chen",
    approvedBy: "Dev Sharma",
  },
  {
    id: "P008",
    itemName: "Philips IntelliSpace PACS",
    category: "Medical Software",
    vendor: "Philips Healthcare",
    quantity: 1,
    unitPrice: 89000,
    totalAmount: 89000,
    purchaseDate: "2024-01-08",
    status: "Pending",
    specifications: "Picture Archiving & Communication System, AI-Enhanced",
    purpose: "Medical Image Storage & AI-Powered Diagnostics",
    requestedBy: "Sarah Johnson",
    approvedBy: "Dev Sharma",
  },
]

export default function PurchasesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    vendor: "",
    quantity: "",
    unitPrice: "",
    specifications: "",
    purpose: "",
    status: "Pending" as "Pending" | "Approved" | "Delivered" | "Cancelled",
  })
  const router = useRouter()

  const categories = [
    "Hardware",
    "Software",
    "Medical Software",
    "Storage",
    "Networking",
    "Security",
    "AI/ML Tools",
    "Cloud Services",
    "Medical Equipment",
    "Office Equipment",
  ]

  const vendors = [
    "NVIDIA Corporation",
    "Intel Corporation",
    "AMD Inc.",
    "Microsoft Corporation",
    "Google Cloud",
    "Amazon Web Services",
    "Epic Systems Corporation",
    "Philips Healthcare",
    "GE Healthcare",
    "Siemens Healthineers",
    "MathWorks Inc.",
    "Dell Technologies",
    "HPE",
    "Samsung Electronics",
    "Western Digital",
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Hardware":
        return <Cpu className="h-4 w-4" />
      case "Software":
      case "Medical Software":
      case "AI/ML Tools":
        return <Monitor className="h-4 w-4" />
      case "Storage":
        return <HardDrive className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const totalPurchaseValue = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
  const pendingPurchases = purchases.filter((p) => p.status === "Pending")
  const deliveredPurchases = purchases.filter((p) => p.status === "Delivered")

  const resetForm = () => {
    setFormData({
      itemName: "",
      category: "",
      vendor: "",
      quantity: "",
      unitPrice: "",
      specifications: "",
      purpose: "",
      status: "Pending",
    })
  }

  const handleAddPurchase = () => {
    if (!formData.itemName || !formData.category || !formData.vendor || !formData.quantity || !formData.unitPrice) {
      alert("Please fill in all required fields")
      return
    }

    const newPurchase: Purchase = {
      id: `P${String(purchases.length + 1).padStart(3, "0")}`,
      itemName: formData.itemName,
      category: formData.category,
      vendor: formData.vendor,
      quantity: Number.parseInt(formData.quantity),
      unitPrice: Number.parseFloat(formData.unitPrice),
      totalAmount: Number.parseInt(formData.quantity) * Number.parseFloat(formData.unitPrice),
      purchaseDate: new Date().toISOString().split("T")[0],
      status: formData.status,
      specifications: formData.specifications,
      purpose: formData.purpose,
      requestedBy: user?.username || "System",
    }

    setPurchases([...purchases, newPurchase])
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Purchase Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Healthcare Technology & Software Procurement</p>
          </div>
          {isCEO && (
            <Button className="healthcare-button" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
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
                    ${totalPurchaseValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchase Value</p>
                </div>
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingPurchases.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{deliveredPurchases.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Delivered Items</p>
                </div>
                <Cpu className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{new Set(purchases.map((p) => p.vendor)).size}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Vendors</p>
                </div>
                <HardDrive className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Table */}
        <Card className="healthcare-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Healthcare Technology Purchases</CardTitle>
                <CardDescription>AI-enabled smart clinic equipment and software procurement</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search purchases..."
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
                    <TableHead>Item & Specifications</TableHead>
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Qty</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden xl:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(purchase.category)}
                            <p className="font-medium text-gray-900 dark:text-gray-100">{purchase.itemName}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                            {purchase.specifications}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 max-w-[200px] truncate">
                            {purchase.purpose}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="font-medium">{purchase.vendor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {purchase.id}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="font-medium">{purchase.quantity}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${purchase.unitPrice.toLocaleString()} each
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-lg">${purchase.totalAmount.toLocaleString()}</p>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <p className="text-sm">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">By: {purchase.requestedBy}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(purchase.status)}>{purchase.status}</Badge>
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
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Purchase
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel Purchase
                                </DropdownMenuItem>
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

        {/* Add Purchase Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Purchase Request</DialogTitle>
              <DialogDescription>Add new healthcare technology or software purchase.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="NVIDIA RTX 4090 GPU"
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Select
                    value={formData.vendor}
                    onValueChange={(value) => setFormData({ ...formData, vendor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "Pending" | "Approved" | "Delivered" | "Cancelled") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    placeholder="1599.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications">Technical Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="24GB GDDR6X, 16384 CUDA Cores, 450W TDP, PCIe 4.0"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Business Purpose</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="AI Medical Imaging Processing & Deep Learning Models"
                  rows={2}
                />
              </div>
              {formData.quantity && formData.unitPrice && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Total Amount: $
                    {(
                      Number.parseInt(formData.quantity || "0") * Number.parseFloat(formData.unitPrice || "0")
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPurchase} className="healthcare-button">
                Create Purchase Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
