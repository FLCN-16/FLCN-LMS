import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
const instituteSettingTasks = [
    "Manage institute profile, branding, and contact details",
    "Configure local academic policies and working structure",
    "Control campus-specific defaults for operations and communication",
];
export default function InstituteSettingsPage() {
    return (<>
      <Helmet>
        <title>Institute Profile — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Institute Profile</h2>
          <p className="text-sm text-muted-foreground">
            Tenant-level setup area for institute identity, local policy, and
            operational defaults.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {instituteSettingTasks.map((task) => (<Card key={task}>
              <CardHeader>
                <CardTitle className="text-base">{task}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Institute configuration APIs are not wired yet, but this page
                  defines the setup space inside the tenant panel.
                </p>
              </CardContent>
            </Card>))}
        </div>
      </div>
    </>);
}
