import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function IntegrationsSettingsPage() {
  return (
    <PanelPlaceholderPage
      title="Integrations"
      description="Configure third-party services, automation endpoints, and operational integrations."
      tasks={[
        "Manage payment, messaging, and meeting integrations",
        "Review integration credentials and access health",
        "Track failures across connected systems",
      ]}
    />
  )
}
