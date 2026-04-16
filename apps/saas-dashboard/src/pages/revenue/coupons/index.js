import { PanelPlaceholderPage } from "@/components/panel-placeholder-page";
export default function RevenueCouponsPage() {
    return (<PanelPlaceholderPage title="Coupons & Discounts" description="Manage discount strategy, coupon campaigns, and promotional eligibility rules." tasks={[
            "Create and expire promotional campaigns",
            "Audit misuse and discount leakage",
            "Measure conversion impact across offers",
        ]}/>);
}
