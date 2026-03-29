"use client"

import { NavLink, useLocation } from "react-router-dom"
import {
  IconBook,
  IconChevronRight,
  IconClipboardList,
  IconListDetails,
  IconSettings2,
  IconTrophy,
} from "@tabler/icons-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@flcn-lms/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@flcn-lms/ui/components/sidebar"

const items = [
  {
    title: "Test Series",
    url: "/panel/test-series",
    icon: IconClipboardList,
    children: [
      { title: "All Series", url: "/panel/test-series" },
      { title: "New Series", url: "/panel/test-series/new" },
    ],
  },
  {
    title: "Question Bank",
    url: "/panel/questions",
    icon: IconBook,
    children: [
      { title: "All Questions", url: "/panel/questions" },
      { title: "New Question", url: "/panel/questions/new" },
    ],
  },
  {
    title: "Attempts",
    url: "/panel/attempts",
    icon: IconListDetails,
    children: null,
  },
  {
    title: "Leaderboard",
    url: "/panel/leaderboard",
    icon: IconTrophy,
    children: null,
  },
]

export function NavTestSeries() {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Test Series</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.children ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={location.pathname.startsWith(item.url)}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={location.pathname.startsWith(item.url)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((child) => (
                      <SidebarMenuSubItem key={child.title}>
                        <NavLink to={child.url} end>
                          {({ isActive }) => (
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <span>{child.title}</span>
                            </SidebarMenuSubButton>
                          )}
                        </NavLink>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url}>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
