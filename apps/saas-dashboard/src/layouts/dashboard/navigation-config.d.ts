import { type IconSvgElement } from "@hugeicons/react";
import type { PermissionDescriptor } from "@flcn-lms/types/auth";
export declare const iconMap: Record<string, IconSvgElement>;
export interface SidebarNavItem {
    title: string;
    url: string;
    icon?: string;
    children?: {
        title: string;
        url: string;
        permission?: PermissionDescriptor;
    }[];
    permission?: PermissionDescriptor;
}
export declare const navigation: Record<string, SidebarNavItem[]>;
export declare const dashboardNavItems: SidebarNavItem[] | undefined;
export declare const managementNavItems: SidebarNavItem[] | undefined;
export declare const billingNavItems: SidebarNavItem[] | undefined;
export declare const sidebarSections: {
    label: string;
    items: SidebarNavItem[] | undefined;
}[];
//# sourceMappingURL=navigation-config.d.ts.map