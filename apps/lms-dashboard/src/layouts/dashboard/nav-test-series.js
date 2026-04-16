"use client";
import { ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@flcn-lms/ui/components/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, } from "@flcn-lms/ui/components/sidebar";
import { iconMap, testSeriesNavItems, } from "./navigation-config";
export function NavTestSeries({ items = testSeriesNavItems, }) {
    const location = useLocation();
    return (<SidebarGroup>
      <SidebarGroupLabel>Test Series</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] : null;
            return item.children ? (<Collapsible key={item.title} asChild defaultOpen={location.pathname.startsWith(item.url)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={location.pathname.startsWith(item.url)}>
                    {Icon && <HugeiconsIcon icon={Icon}/>}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((child) => (<SidebarMenuSubItem key={child.title}>
                          <NavLink to={child.url} end>
                            {({ isActive }) => (<SidebarMenuSubButton asChild isActive={isActive}>
                                <span>{child.title}</span>
                              </SidebarMenuSubButton>)}
                          </NavLink>
                        </SidebarMenuSubItem>))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>) : (<SidebarMenuItem key={item.title}>
              <NavLink to={item.url}>
                {({ isActive }) => (<SidebarMenuButton tooltip={item.title} isActive={isActive}>
                    {Icon && <HugeiconsIcon icon={Icon}/>}
                    <span>{item.title}</span>
                  </SidebarMenuButton>)}
              </NavLink>
            </SidebarMenuItem>);
        })}
      </SidebarMenu>
    </SidebarGroup>);
}
