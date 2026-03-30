import React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Book01Icon,
  Bookmark02Icon,
  LibraryIcon,
  Settings05Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons"

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

function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("panel.user.sidebar")

  const menuItems = [
    {
      title: "Library",
      url: "/user/library",
      icon: LibraryIcon,
    },
    {
      title: "Bookmarks",
      url: "/user/bookmarks",
      icon: Bookmark02Icon,
    },
    {
      title: t("orders"),
      url: "/user/orders",
      icon: TransactionHistoryIcon,
    },
    {
      title: t("settings"),
      url: "/user/settings",
      icon: Settings05Icon,
    },
  ]

  return (
    <Sidebar id="user-sidebar" collapsible="icon" {...props}>
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
                <SidebarMenuItem
                  key={item.title}
                  className="flex items-center gap-2"
                >
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <HugeiconsIcon icon={item.icon} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

export default UserSidebar
