import { PanelPlaceholderPage } from "@/components/panel-placeholder-page"

export default function NewDppPage() {
  return (
    <PanelPlaceholderPage
      title="Create DPP"
      description="Prepare a dedicated DPP creation workspace for academic operations and faculty teams."
      tasks={[
        "Choose target batch and subject focus",
        "Attach questions or worksheets to the DPP",
        "Set release and submission expectations",
      ]}
    />
  )
}
