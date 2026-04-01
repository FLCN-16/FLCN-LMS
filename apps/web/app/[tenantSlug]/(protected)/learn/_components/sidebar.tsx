import {
  Book01Icon,
  Settings05Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import React from "react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@flcn-lms/ui/components/sidebar"

interface ResourceSidebarMenuItemProps {
  id: string
  title: string
  icon: IconSvgElement
}

function ResourceSidebarMenuItem({
  id,
  title,
  icon,
}: ResourceSidebarMenuItemProps) {
  return (
    <SidebarMenuItem key={id} className="flex items-center gap-2">
      <SidebarMenuButton tooltip={title}>
        {icon && <HugeiconsIcon icon={icon} />}
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function CourseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("panel.courseSidebar")

  const menuItems = [
    { id: "orders", title: t("orders"), icon: TransactionHistoryIcon },
    { id: "settings", title: t("settings"), icon: Settings05Icon },
  ]

  return (
    <Sidebar id="user-sidebar" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={Book01Icon} className="size-4" />
                </div>
                <span className="text-base font-semibold">
                  {t("brandName")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <ResourceSidebarMenuItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  icon={item.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

export default CourseSidebar
