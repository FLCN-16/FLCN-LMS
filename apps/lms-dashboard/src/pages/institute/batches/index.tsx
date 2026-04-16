import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

import { useBatchesList, useDeleteBatch } from "@/queries/batches"

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "default"
    case "inactive":
      return "secondary"
    case "completed":
      return "outline"
    default:
      return "secondary"
  }
}

export default function InstituteBatchesPage() {
  const { data: batches = [], isLoading } = useBatchesList()
  const deleteMutation = useDeleteBatch()

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      deleteMutation.mutate({ id })
    }
  }

  return (
    <>
      <Helmet>
        <title>Batches — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Batches</h2>
            <p className="text-sm text-muted-foreground">
              {batches.length} batches
            </p>
          </div>

          <Button size="sm" asChild>
            <Link to="/institute/batches/new">
              <IconPlus className="size-4" />
              New Batch
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No batches are available yet.
          </p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {batches.map((batch) => (
              <Card key={batch.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {batch.name}
                      </CardTitle>
                    </div>
                    <Badge variant={getStatusVariant(batch.status)}>
                      {batch.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {batch.description && (
                    <p className="text-sm text-muted-foreground">
                      {batch.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/institute/batches/${batch.id}/edit`}>
                        <IconPencil className="size-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(batch.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <IconTrash className="size-3.5" />
                      Delete
                    </Button>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Students</p>
                      <p className="font-medium">
                        {batch.studentCount}/{batch.capacity ?? "—"}
                      </p>
                    </div>
                    {batch.startDate && (
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">
                          {new Date(batch.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
