import type { PermissionDescriptor } from "@flcn-lms/types/auth";
import { type AppAbility } from "@/lib/ability";
export declare function NavMain({ items, ability, }: {
    items: {
        title: string;
        url: string;
        icon?: string;
        permission?: PermissionDescriptor;
    }[];
    ability: AppAbility;
}): import("react").JSX.Element;
//# sourceMappingURL=nav-main.d.ts.map