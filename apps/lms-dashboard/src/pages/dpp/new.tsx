import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"

import { useCreateDpp } from "@/queries/dpp"

import { DPPForm } from "./dpp-form"

export default function NewDppPage() {
  const navigate = useNavigate()
  const createMutation = useCreateDpp()

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/dpp")
      },
    })
  }

  return (
    <>
      <Helmet>
        <title>New Daily Practice Paper — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dpp">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Daily Practice Paper</h2>
            <p className="text-sm text-muted-foreground">
              Create a new daily practice paper for your course
            </p>
          </div>
        </div>

        {createMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to create DPP. Please try again.
          </p>
        )}

        <DPPForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Create DPP"
        />
      </div>
    </>
  )
}
