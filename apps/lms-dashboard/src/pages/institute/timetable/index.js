import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
const timetableTasks = [
    "Organize class schedules across batches and faculty",
    "Track room, slot, and session conflicts",
    "Coordinate timetable changes with academic operations",
];
export default function InstituteTimetablePage() {
    return (<>
      <Helmet>
        <title>Timetable — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Timetable</h2>
          <p className="text-sm text-muted-foreground">
            Institute scheduling workspace for classes, faculty allocation, and
            daily academic planning.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {timetableTasks.map((task) => (<Card key={task}>
              <CardHeader>
                <CardTitle className="text-base">{task}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Scheduling APIs are not wired yet, but this page establishes
                  the timetable management area in the tenant panel.
                </p>
              </CardContent>
            </Card>))}
        </div>
      </div>
    </>);
}
