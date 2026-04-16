import { GlobalEducationIcon, } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, } from "@flcn-lms/ui/components/sidebar";
import useAuth from "@/features/auth/use-auth.hook";
import { NavMain } from "./nav-main";
import { NavSection } from "./nav-section";
import { NavUser } from "./nav-user";
import { dashboardNavItems, sidebarSections } from "./navigation-config";
export function AppSidebar({ ...props }) {
    const auth = useAuth();
    return (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/panel">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={GlobalEducationIcon} className="size-5"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-base">FLCN LMS</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dashboardNavItems} ability={auth.ability}/>
        {sidebarSections.map((section) => (<React.Fragment key={section.label}>
            <SidebarSeparator />
            <NavSection label={section.label} items={section.items} ability={auth.ability}/>
          </React.Fragment>))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{
            name: auth.user?.name ?? "Admin",
            email: auth.user?.email ?? "admin@example.com",
            avatar: auth.user?.avatarUrl ?? "",
        }}/>
      </SidebarFooter>
    </Sidebar>);
}
