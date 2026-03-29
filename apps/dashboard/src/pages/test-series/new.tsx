import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@flcn-lms/ui/components/button"

import { testSeriesApi, type CreateTestSeriesPayload } from "../../lib/api/test-series"
import { SeriesForm } from "./series-form"

export default function NewTestSeriesPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateTestSeriesPayload) => testSeriesApi.create(data),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["test-series"] })
      navigate(`/panel/test-series/${created.id}`)
    },
  })

  return (
    <>
      <Helmet>
        <title>New Test Series — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/panel/test-series">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Test Series</h2>
            <p className="text-sm text-muted-foreground">Create a new test series bundle</p>
          </div>
        </div>

        {mutation.isError && (
          <p className="mb-4 text-sm text-destructive">Failed to create. Please try again.</p>
        )}

        <SeriesForm
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          submitLabel="Create Series"
        />
      </div>
    </>
  )
}
