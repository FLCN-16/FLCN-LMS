import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"

import { useCreateBatch } from "@/queries/batches"

import { BatchForm } from "./batch-form"

export default function NewBatchPage() {
  const navigate = useNavigate()
  const createMutation = useCreateBatch()

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/institute/batches")
      },
    })
  }

  return (
    <>
      <Helmet>
        <title>New Batch — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/institute/batches">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Batch</h2>
            <p className="text-sm text-muted-foreground">
              Create a new student batch
            </p>
          </div>
        </div>

        {createMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to create batch. Please try again.
          </p>
        )}

        <BatchForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Create Batch"
        />
      </div>
    </>
  )
}
