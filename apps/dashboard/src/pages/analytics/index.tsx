import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function AnalyticsOverviewPage() {
  return (
    <PanelPlaceholderPage
      title="Analytics Overview"
      description="Executive view of learning, revenue, and engagement signals across the admin panel."
      tasks={[
        "Watch platform-wide performance trends",
        "Review learner growth and conversion patterns",
        "Spot anomalies across academic operations",
      ]}
    />
  )
}
