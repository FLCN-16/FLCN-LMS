import { FullScreenIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { Button } from "@flcn-lms/ui/components/button"
import { Separator } from "@flcn-lms/ui/components/separator"
import { SidebarTrigger } from "@flcn-lms/ui/components/sidebar"

function CourseHeader() {
  const t = useTranslations("common")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-8"
        />
        <h1 className="text-base font-medium">{t("documents")}</h1>

        <div className="ml-auto">
          <Button variant="ghost" size="icon-lg">
            <HugeiconsIcon icon={FullScreenIcon} />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default CourseHeader
