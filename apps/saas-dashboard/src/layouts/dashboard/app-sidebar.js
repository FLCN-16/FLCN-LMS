import { GlobalEducationIcon } from "@hugeicons/core-free-icons";
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
    return (<Sidebar collapsible="icon" className="border-r border-border" {...props}>
      {/* Sidebar Header - Logo & Branding */}
      <SidebarHeader className="border-b border-border/50 bg-gradient-to-b from-background to-background/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="transition-colors duration-200 hover:bg-accent/50 data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/" className="group">
                {/* Logo Badge */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-violet-500 text-white shadow-md transition-shadow duration-200 group-hover:shadow-lg">
                  <HugeiconsIcon icon={GlobalEducationIcon} className="size-5"/>
                </div>

                {/* Text - Hidden when collapsed */}
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate bg-gradient-to-r from-amber-600 to-violet-600 bg-clip-text text-base font-bold text-transparent dark:from-amber-400 dark:to-violet-400">
                    FLCN LMS
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content - Navigation */}
      <SidebarContent className="px-0">
        <NavMain items={dashboardNavItems} ability={auth.ability}/>
        {sidebarSections.map((section) => (<React.Fragment key={section.label}>
            <SidebarSeparator className="my-2 opacity-50"/>
            <NavSection label={section.label} items={section.items} ability={auth.ability}/>
          </React.Fragment>))}
      </SidebarContent>

      {/* Sidebar Footer - User Menu & Actions */}
      <SidebarFooter className="border-t border-border/50 bg-gradient-to-t from-background to-background/50">
        <NavUser user={{
            name: auth.user?.name ?? "Administrator",
            email: auth.user?.email ?? "admin@example.com",
            avatar: auth.user?.avatarUrl ?? "",
            role: auth.user?.role ?? "super_admin",
        }}/>
      </SidebarFooter>
    </Sidebar>);
}
