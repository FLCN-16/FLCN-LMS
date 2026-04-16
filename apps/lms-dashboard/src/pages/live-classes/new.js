import { PanelPlaceholderPage } from "@/components/panel-placeholder-page";
export default function NewLiveClassPage() {
    return (<PanelPlaceholderPage title="Schedule Live Class" description="Set up a dedicated scheduler for live class planning, faculty assignment, and learner notifications." tasks={[
            "Choose batch, faculty, and class agenda",
            "Schedule the delivery slot and meeting link",
            "Prepare reminders and learner access rules",
        ]}/>);
}
