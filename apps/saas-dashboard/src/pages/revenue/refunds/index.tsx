import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function RevenueRefundsPage() {
  return (
    <PanelPlaceholderPage
      title="Refunds"
      description="Handle refund approvals, status tracking, and policy-based payment reversals."
      tasks={[
        "Review refund requests and approval queues",
        "Track gateway refund completion state",
        "Audit refund reasons and policy exceptions",
      ]}
    />
  )
}
