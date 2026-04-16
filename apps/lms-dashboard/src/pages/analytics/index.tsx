import { Helmet } from "react-helmet-async"

import {
  EnrollmentTrend,
  CoursePerformance,
  RevenueBreakdown,
  UserDistribution,
  StatCards,
} from "@/components/analytics-charts"

export default function AnalyticsOverviewPage() {
  return (
    <>
      <Helmet>
        <title>Analytics Overview — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            Executive view of learning, revenue, and engagement signals across the admin panel
          </p>
        </div>

        <div className="space-y-6">
          <StatCards />

          <div className="grid gap-6 md:grid-cols-2">
            <EnrollmentTrend />
            <UserDistribution />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CoursePerformance />
            <RevenueBreakdown />
          </div>
        </div>
      </div>
    </>
  )
}
