import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function TestReportsPage() {
  return (
    <PanelPlaceholderPage
      title="Test Reports"
      description="Assessment reporting area for result analysis, difficulty trends, and series effectiveness."
      tasks={[
        "Analyze performance by test series and exam type",
        "Review attempt quality and difficulty balance",
        "Track score movement across cohorts",
      ]}
    />
  )
}
