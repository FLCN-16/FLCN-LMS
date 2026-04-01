import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function ContentReviewPage() {
  return (
    <PanelPlaceholderPage
      title="Content Review"
      description="Quality-control area for reviewing course, question, and live-session content before release."
      tasks={[
        "Approve or reject pending educational assets",
        "Review SEO and academic quality standards",
        "Track publishing bottlenecks across teams",
      ]}
    />
  )
}
