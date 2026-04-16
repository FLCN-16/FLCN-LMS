import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function CourseReportsPage() {
  return (
    <PanelPlaceholderPage
      title="Course Reports"
      description="Course-level reporting workspace for performance, consumption, and completion insights."
      tasks={[
        "Compare course performance across catalogs",
        "Track completion and learner retention rates",
        "Identify content needing revision or support",
      ]}
    />
  )
}
