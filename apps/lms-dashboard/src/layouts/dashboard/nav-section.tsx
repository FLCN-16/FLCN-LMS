"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronRight } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

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

import { canAccess, type AppAbility } from "@/lib/ability"

import { iconMap, type SidebarNavItem } from "./navigation-config"

export function NavSection({
  label,
  items,
  ability,
}: {
  label: string
  items: SidebarNavItem[]
  ability: AppAbility
}) {
  const location = useLocation()
  const visibleItems = items
    .map((item: SidebarNavItem) => ({
      ...item,
      children:
        item.children?.filter((child) =>
          canAccess(ability, child.permission)
        ) || undefined,
    }))
    .filter(
      (item) =>
        canAccess(ability, item.permission) &&
        (item.children === undefined || item.children.length > 0)
    )

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item: SidebarNavItem) => {
          const Icon = item.icon ? iconMap[item.icon] : null
          return item.children ? (
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
                    {Icon && <HugeiconsIcon icon={Icon} />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children?.map(
                      (child: { title: string; url: string }) => (
                        <SidebarMenuSubItem key={child.title}>
                          <NavLink to={child.url} end>
                            {({ isActive }) => (
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <span>{child.title}</span>
                              </SidebarMenuSubButton>
                            )}
                          </NavLink>
                        </SidebarMenuSubItem>
                      )
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url} end={item.url === "/panel"}>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                    {Icon && <HugeiconsIcon icon={Icon} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
