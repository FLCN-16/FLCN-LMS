import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import { Loader } from "@/components/loader"

import { useBatchDetail, useUpdateBatch } from "@/queries/batches"
import { BatchForm } from "./batch-form"

export default function EditBatchPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: batch, isLoading } = useBatchDetail({ id: id! }, { enabled: !!id })
  const updateMutation = useUpdateBatch()

  const handleSubmit = (data: any) => {
    if (!id) return
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate("/institute/batches")
        },
      }
    )
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Helmet>
        <title>Edit Batch — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/institute/batches">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Batch</h2>
            <p className="text-sm text-muted-foreground">
              Update the details of your batch
            </p>
          </div>
        </div>

        {updateMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to update batch. Please try again.
          </p>
        )}

        <BatchForm
          defaultValues={batch}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Update Batch"
        />
      </div>
    </>
  )
}
