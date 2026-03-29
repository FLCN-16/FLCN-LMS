import { Helmet } from "react-helmet-async"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@flcn-lms/ui/components/button"

import { testSeriesApi, type CreateTestPayload } from "../../lib/api/test-series"
import { TestForm } from "./test-form"

export default function NewTestPage() {
  const { seriesId } = useParams<{ seriesId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: series } = useQuery({
    queryKey: ["test-series", seriesId],
    queryFn: () => testSeriesApi.get(seriesId!),
    enabled: !!seriesId,
  })

  const { data: tests = [] } = useQuery({
    queryKey: ["tests", seriesId],
    queryFn: () => testSeriesApi.listTests(seriesId!),
    enabled: !!seriesId,
  })

  const mutation = useMutation({
    mutationFn: (data: CreateTestPayload) => testSeriesApi.createTest(seriesId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests", seriesId] })
      navigate(`/panel/test-series/${seriesId}`)
    },
  })

  return (
    <>
      <Helmet>
        <title>New Test — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/panel/test-series/${seriesId}`}>
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Test</h2>
            <p className="text-sm text-muted-foreground">{series?.title}</p>
          </div>
        </div>

        {mutation.isError && (
          <p className="mb-4 text-sm text-destructive">Failed to create test. Please try again.</p>
        )}

        <TestForm
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          nextOrder={tests.length + 1}
          submitLabel="Create Test"
        />
      </div>
    </>
  )
}
