import { Helmet } from "react-helmet-async"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

const facultyTasks = [
  "Assign instructors to courses and series",
  "Manage teaching teams and ownership",
  "Track faculty readiness for upcoming sessions",
]

export default function InstituteFacultyPage() {
  return (
    <>
      <Helmet>
        <title>Faculty — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Faculty</h2>
          <p className="text-sm text-muted-foreground">
            Institute admin area for managing instructors and teaching staff.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {facultyTasks.map((task) => (
            <Card key={task}>
              <CardHeader>
                <CardTitle className="text-base">{task}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Faculty APIs are not available yet, but the navigation and
                  page shell are now ready for them.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
