import { Briefcase03Icon, BuildingIcon, Chart01Icon, CreditCardIcon, File02Icon, Home01Icon, Key01Icon, ShapesIcon, User02Icon, Wallet02Icon, } from "@hugeicons/core-free-icons";
export const iconMap = {
    gauge: Home01Icon,
    user02: User02Icon,
    building: BuildingIcon,
    shapes: ShapesIcon,
    trending: Chart01Icon,
    "briefcase-business": Briefcase03Icon,
    "key01": Key01Icon,
    "credit-card": CreditCardIcon,
    "file-spreadsheet": File02Icon,
    wallet: Wallet02Icon,
};
export const navigation = {
    main: [
        { title: "Overview", url: "/", icon: "gauge" },
    ],
    management: [
        { title: "Super Admins", url: "/super-admins", icon: "user02" },
        { title: "Customers", url: "/customers", icon: "building" },
        { title: "Plans", url: "/plans", icon: "shapes" },
        { title: "Licenses", url: "/licenses", icon: "briefcase-business" },
        { title: "API Keys", url: "/api-keys", icon: "key01" },
    ],
    billing: [
        { title: "Subscriptions", url: "/subscriptions", icon: "trending" },
        {
            title: "Billing Records",
            url: "/billing",
            icon: "credit-card",
        },
        { title: "Invoices", url: "/invoices", icon: "file-spreadsheet" },
        { title: "Refunds", url: "/refunds", icon: "wallet" },
    ],
};
export const dashboardNavItems = navigation.main;
export const managementNavItems = navigation.management;
export const billingNavItems = navigation.billing;
export const sidebarSections = [
    { label: "Management", items: navigation.management },
    { label: "Billing", items: navigation.billing },
];
