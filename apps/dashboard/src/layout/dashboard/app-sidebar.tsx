"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@flcn-lms/ui/components/sidebar"

import { NavMain } from "./nav-main"
import { NavTestSeries } from "./nav-test-series"
import { NavUser } from "./nav-user"

const navMain = [
  { title: "Dashboard", url: "/panel", icon: IconDashboard },
  { title: "Analytics", url: "/panel/analytics", icon: IconChartBar },
  { title: "Users", url: "/panel/users", icon: IconUsers },
]

const navSecondary = [
  { title: "Settings", url: "/panel/settings", icon: IconSettings },
  { title: "Help", url: "#", icon: IconHelp },
]

const user = {
  name: "Admin",
  email: "admin@example.com",
  avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/panel">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">FLCN LMS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <SidebarSeparator />
        <NavTestSeries />
        <SidebarSeparator />
        <NavMain items={navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
