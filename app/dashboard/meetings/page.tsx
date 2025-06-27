"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Plus, Video, MapPin } from "lucide-react"

interface User {
  username: string
  designation: string
  id: string
}

interface Meeting {
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

const mockMeetings: Meeting[] = [
  {
    id: "1",
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
    id: "2",
    title: "Financial Review Meeting",
    description: "Monthly financial performance analysis",
    date: "2024-01-16",
    time: "14:30",
    duration: 90,
    attendees: ["Dev Sharma", "Sarah Johnson", "Lisa Thompson"],
    location: "Zoom Meeting",
    type: "Virtual",
    status: "Scheduled",
    organizer: "Sarah Johnson",
  },
  {
    id: "3",
    title: "Team Standup",
    description: "Daily team synchronization and updates",
    date: "2024-01-17",
    time: "09:00",
    duration: 30,
    attendees: ["Michael Chen", "David Kim", "Lisa Thompson"],
    location: "Conference Room B",
    type: "Hybrid",
    status: "Scheduled",
    organizer: "Michael Chen",
  },
  {
    id: "4",
    title: "Client Presentation",
    description: "Quarterly business review with MedTech Solutions",
    date: "2024-01-17",
    time: "15:00",
    duration: 60,
    attendees: ["Dev Sharma", "Sarah Johnson", "Lisa Thompson"],
    location: "Client Office",
    type: "In-Person",
    status: "Scheduled",
    organizer: "Lisa Thompson",
  },
  {
    id: "5",
    title: "HR Policy Review",
    description: "Annual review of company policies and procedures",
    date: "2024-01-15",
    time: "11:00",
    duration: 180,
    attendees: ["Dev Sharma", "Emily Rodriguez", "Sarah Johnson"],
    location: "Conference Room A",
    type: "In-Person",
    status: "Completed",
    organizer: "Emily Rodriguez",
  },
]

export default function MeetingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Virtual":
        return <Video className="h-4 w-4" />
      case "In-Person":
        return <MapPin className="h-4 w-4" />
      case "Hybrid":
        return <Users className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const upcomingMeetings = meetings.filter((m) => m.status === "Scheduled")
  const todayMeetings = meetings.filter(
    (m) => m.date === new Date().toISOString().split("T")[0] && m.status === "Scheduled",
  )

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meeting Management</h1>
            <p className="text-gray-600 mt-2">Schedule and manage all company meetings</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{todayMeetings.length}</p>
                  <p className="text-sm text-gray-600">Today's Meetings</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{upcomingMeetings.length}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {meetings.filter((m) => m.type === "Virtual").length}
                  </p>
                  <p className="text-sm text-gray-600">Virtual Meetings</p>
                </div>
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {meetings.filter((m) => m.status === "Completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Meetings scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayMeetings.length > 0 ? (
                  todayMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {meeting.time} ({meeting.duration} min)
                            </div>
                            <div className="flex items-center">
                              {getTypeIcon(meeting.type)}
                              <span className="ml-1">{meeting.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center mt-2">
                            <Users className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-600">{meeting.attendees.length} attendees</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No meetings scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>All scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(meeting.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {meeting.time}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-600">{meeting.attendees.length} attendees</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {meeting.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
