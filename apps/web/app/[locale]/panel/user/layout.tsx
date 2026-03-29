import { useTranslations } from "next-intl"
import { SidebarInset, SidebarProvider } from "@flcn-lms/ui/components/sidebar"

import Sidebar from "./_components/sidebar"
import UserHeader from "./_components/header"

async function UserLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("panel.user")

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <Sidebar variant="inset" />
        <SidebarInset id="user-main">
          <UserHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                {children}
              </div>
            </div>
          </div>
          <footer className="p-4">
            <p className="text-sm text-muted-foreground">
              {t("footerCopyright")}
            </p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default UserLayout
