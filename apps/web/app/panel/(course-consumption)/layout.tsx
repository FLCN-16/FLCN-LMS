import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

import Sidebar from "./_components/sidebar"
import CourseHeader from "./_components/header"

async function CourseConsumptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 100)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <Sidebar variant="inset" />
        <SidebarInset id="course-main">
          <CourseHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                {children}
              </div>
            </div>
          </div>
          <footer className="p-4">
            <p className="text-sm text-muted-foreground">
              © 2026 FLCN LMS. All rights reserved.
            </p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default CourseConsumptionLayout
