import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

// Sample data for enrollment trends
const enrollmentData = [
  { month: "Jan", new: 400, total: 2400 },
  { month: "Feb", new: 520, total: 2920 },
  { month: "Mar", new: 680, total: 3600 },
  { month: "Apr", new: 750, total: 4350 },
  { month: "May", new: 920, total: 5270 },
  { month: "Jun", new: 1100, total: 6370 },
]

// Sample data for course performance
const coursePerformanceData = [
  { name: "Physics 101", students: 450, completion: 78, rating: 4.5 },
  { name: "Chemistry 101", students: 380, completion: 72, rating: 4.2 },
  { name: "Biology 101", students: 520, completion: 85, rating: 4.7 },
  { name: "Math 101", students: 610, completion: 88, rating: 4.8 },
  { name: "English 101", students: 290, completion: 65, rating: 4.0 },
]

// Sample data for revenue
const revenueData = [
  { month: "Jan", revenue: 24000, subscriptions: 18000, courses: 6000 },
  { month: "Feb", revenue: 28900, subscriptions: 21000, courses: 7900 },
  { month: "Mar", revenue: 32400, subscriptions: 23000, courses: 9400 },
  { month: "Apr", revenue: 35800, subscriptions: 25000, courses: 10800 },
  { month: "May", revenue: 42100, subscriptions: 29000, courses: 13100 },
  { month: "Jun", revenue: 48300, subscriptions: 33000, courses: 15300 },
]

// Sample data for user distribution
const userDistributionData = [
  { name: "Students", value: 3500, fill: "#3b82f6" },
  { name: "Instructors", value: 120, fill: "#8b5cf6" },
  { name: "Admins", value: 8, fill: "#10b981" },
]

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981"]

export function EnrollmentTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Trends</CardTitle>
        <CardDescription>New and total enrollments over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="new" stroke="#3b82f6" name="New Enrollments" />
            <Line type="monotone" dataKey="total" stroke="#10b981" name="Total Enrollments" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function CoursePerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
        <CardDescription>Student enrollment and completion rates by course</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={coursePerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#3b82f6" name="Students" />
            <Bar dataKey="completion" fill="#10b981" name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RevenueBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Monthly revenue from subscriptions and courses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Bar dataKey="subscriptions" fill="#8b5cf6" name="Subscriptions" />
            <Bar dataKey="courses" fill="#f59e0b" name="Courses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function UserDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>Breakdown of platform users by role</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={userDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {userDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function StatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">3,500</div>
          <p className="mt-1 text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">24</div>
          <p className="mt-1 text-xs text-muted-foreground">+3 new courses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$48.3K</div>
          <p className="mt-1 text-xs text-muted-foreground">+14% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">78%</div>
          <p className="mt-1 text-xs text-muted-foreground">Platform wide average</p>
        </CardContent>
      </Card>
    </div>
  )
}
