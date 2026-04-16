import {
  ArrowRight,
  BookOpen,
  Calendar,
  GraduationCap,
  PlusCircle,
  UserPlus,
  Users,
} from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Skeleton } from "@flcn-lms/ui/components/skeleton"

import { getInstituteSlug } from "@/lib/institute"
import { useInstituteStats } from "@/queries/stats"

function HomePage() {
  const instituteSlug = getInstituteSlug()
  const { data: stats, isLoading } = useInstituteStats(instituteSlug)

  const statCards = [
    {
      title: "Active Students",
      value: stats?.counts.students ?? 0,
      icon: Users,
      description: "Enrolled in active courses",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Faculty Members",
      value: stats?.counts.instructor ?? 0,
      icon: GraduationCap,
      description: "Instructors and administrators",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Courses",
      value: stats?.counts.courses ?? 0,
      icon: BookOpen,
      description: "Published and scheduled",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Live Sessions Today",
      value: stats?.todaySessions ?? 0,
      icon: Calendar,
      description: "Ongoing and upcoming",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 py-2 md:gap-8 md:px-6">
      <Helmet>
        <title>Dashboard — FLCN Management</title>
      </Helmet>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Dashboard
        </h1>
        <p className="text-muted-foreground">
          Here is what&apos;s happening in your institute today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card
            key={i}
            className="overflow-hidden border-none shadow-sm ring-1 ring-border/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common management tasks you can perform quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-2 py-4"
            >
              <Link to="/institute/students">
                <UserPlus className="h-4 w-4 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Add New Student</span>
                  <span className="text-xs text-muted-foreground">
                    Enroll a student manually
                  </span>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-2 py-4"
            >
              <Link to="/courses/new">
                <PlusCircle className="h-4 w-4 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Create Course</span>
                  <span className="text-xs text-muted-foreground">
                    Draft a new syllabus
                  </span>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-2 py-4"
            >
              <Link to="/live-classes/new">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Schedule Live Class</span>
                  <span className="text-xs text-muted-foreground">
                    Set up a video session
                  </span>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-2 py-4"
            >
              <Link to="/questions/new">
                <BookOpen className="h-4 w-4 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Add Question</span>
                  <span className="text-xs text-muted-foreground">
                    Populate question bank
                  </span>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest events from your institute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Backend implemented</p>
                  <p className="text-xs text-muted-foreground">
                    Dashboard system initialized
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <div className="flex items-center gap-4 text-sm opacity-50">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <p className="font-medium">No activity log found</p>
                  <p className="text-xs text-muted-foreground">
                    Real-time logs coming soon
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-between"
              asChild
            >
              <Link to="/analytics">
                View all activity
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
