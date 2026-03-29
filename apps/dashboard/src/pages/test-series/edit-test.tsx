import { Helmet } from "react-helmet-async"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@flcn-lms/ui/components/button"
import { Skeleton } from "@flcn-lms/ui/components/skeleton"

import { testSeriesApi, type CreateTestPayload } from "../../lib/api/test-series"
import { TestForm } from "./test-form"

export default function EditTestPage() {
  const { seriesId, testId } = useParams<{ seriesId: string; testId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: series } = useQuery({
    queryKey: ["test-series", seriesId],
    queryFn: () => testSeriesApi.get(seriesId!),
    enabled: !!seriesId,
  })

  const { data: test, isLoading } = useQuery({
    queryKey: ["tests", seriesId, testId],
    queryFn: () => testSeriesApi.getTest(seriesId!, testId!),
    enabled: !!seriesId && !!testId,
  })

  const mutation = useMutation({
    mutationFn: (data: CreateTestPayload) => testSeriesApi.updateTest(seriesId!, testId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests", seriesId] })
      navigate(`/panel/test-series/${seriesId}`)
    },
  })

  return (
    <>
      <Helmet>
        <title>Edit Test — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/panel/test-series/${seriesId}`}>
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Test</h2>
            <p className="text-sm text-muted-foreground">{series?.title}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex max-w-xl flex-col gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : test ? (
          <TestForm
            defaultValues={test}
            onSubmit={(data) => mutation.mutate(data)}
            isLoading={mutation.isPending}
            submitLabel="Save Changes"
          />
        ) : (
          <p className="text-sm text-muted-foreground">Test not found.</p>
        )}
      </div>
    </>
  )
}
