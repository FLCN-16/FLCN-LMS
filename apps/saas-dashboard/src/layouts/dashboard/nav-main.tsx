"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { NavLink } from "react-router-dom"

import type { PermissionDescriptor } from "@flcn-lms/types/auth"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@flcn-lms/ui/components/sidebar"

import { canAccess, type AppAbility } from "@/lib/ability"

import { iconMap } from "./navigation-config"

export function NavMain({
  items,
  ability,
}: {
  items: {
    title: string
    url: string
    icon?: string
    permission?: PermissionDescriptor
  }[]
  ability: AppAbility
}) {
  const visibleItems = items.filter((item) =>
    canAccess(ability, item.permission)
  )

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {visibleItems.map(
            (item: { title: string; url: string; icon?: string }) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end={item.url === "/panel"}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        {Icon && <HugeiconsIcon icon={Icon} />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              )
            }
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
