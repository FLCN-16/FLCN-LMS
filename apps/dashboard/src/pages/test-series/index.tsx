import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconChevronRight, IconPlus, IconSend, IconTrash, IconPencil } from "@tabler/icons-react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@flcn-lms/ui/components/card"

import { testSeriesApi } from "../../lib/api/test-series"

export default function TestSeriesPage() {
  const qc = useQueryClient()

  const { data: series = [], isLoading } = useQuery({
    queryKey: ["test-series"],
    queryFn: () => testSeriesApi.list(),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => testSeriesApi.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["test-series"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testSeriesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["test-series"] }),
  })

  return (
    <>
      <Helmet>
        <title>Test Series — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Test Series</h2>
            <p className="text-sm text-muted-foreground">{series.length} series</p>
          </div>
          <Button size="sm" asChild>
            <Link to="/panel/test-series/new">
              <IconPlus className="size-4" />
              New Series
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : series.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No test series yet.{" "}
            <Link to="/panel/test-series/new" className="underline underline-offset-4">
              Create one.
            </Link>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {series.map((s) => (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{s.title}</CardTitle>
                    <Badge variant={s.isPublished ? "default" : "secondary"} className="shrink-0">
                      {s.isPublished ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.examType} · {s.totalTests} tests
                    {s.isPaid && s.price ? ` · ₹${s.price}` : " · Free"}
                  </p>
                </CardHeader>
                <CardContent>
                  {s.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/panel/test-series/${s.id}`}>
                        Tests <IconChevronRight className="size-3" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/panel/test-series/${s.id}/edit`}>
                        <IconPencil className="size-3" />
                        Edit
                      </Link>
                    </Button>
                    {!s.isPublished && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => publishMutation.mutate(s.id)}
                        disabled={publishMutation.isPending}
                      >
                        <IconSend className="size-3" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 ml-auto text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(s.id)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
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
