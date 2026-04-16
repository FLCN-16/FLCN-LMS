import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import { Loader } from "@/components/loader"

import { useDppDetail, useUpdateDpp } from "@/queries/dpp"
import { DPPForm } from "./dpp-form"

export default function EditDppPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dpp, isLoading } = useDppDetail({ id: id! }, { enabled: !!id })
  const updateMutation = useUpdateDpp()

  const handleSubmit = (data: any) => {
    if (!id) return
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate("/dpp")
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
        <title>Edit Daily Practice Paper — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dpp">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Daily Practice Paper</h2>
            <p className="text-sm text-muted-foreground">
              Update the details of your daily practice paper
            </p>
          </div>
        </div>

        {updateMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to update DPP. Please try again.
          </p>
        )}

        <DPPForm
          defaultValues={dpp}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Update DPP"
        />
      </div>
    </>
  )
}
