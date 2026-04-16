import { Helmet } from "react-helmet-async"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

const batchTasks = [
  "Organize students into academic batches",
  "Map batches to courses and test series",
  "Coordinate delivery schedules and faculty alignment",
]

export default function InstituteBatchesPage() {
  return (
    <>
      <Helmet>
        <title>Batches — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Batches</h2>
          <p className="text-sm text-muted-foreground">
            Institute-level grouping space for cohort and program operations.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {batchTasks.map((task) => (
            <Card key={task}>
              <CardHeader>
                <CardTitle className="text-base">{task}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Batch tooling can connect here once institute operations APIs
                  are introduced in the backend.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
