import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
const attendanceTasks = [
    "Track daily attendance by batch and class",
    "Review absentee patterns and follow-up actions",
    "Prepare attendance summaries for institute operations",
];
export default function InstituteAttendancePage() {
    return (<>
      <Helmet>
        <title>Attendance — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p className="text-sm text-muted-foreground">
            Institute attendance workspace for class presence tracking and
            academic compliance.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {attendanceTasks.map((task) => (<Card key={task}>
              <CardHeader>
                <CardTitle className="text-base">{task}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Attendance APIs are not wired yet, but this section is ready
                  for institute-level workflow integration.
                </p>
              </CardContent>
            </Card>))}
        </div>
      </div>
    </>);
}
