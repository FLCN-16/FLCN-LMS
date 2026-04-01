import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link, useParams } from "react-router-dom"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Skeleton } from "@flcn-lms/ui/components/skeleton"

import { useAttemptResult } from "@/queries/attempts"

function fmt(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${s}s`
}

export default function AttemptResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>()

  const { data: result, isLoading } = useAttemptResult({
    variables: { attemptId: attemptId! },
    enabled: !!attemptId,
  })

  return (
    <>
      <Helmet>
        <title>Attempt Result — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/attempts">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Attempt Result</h2>
            <p className="font-mono text-xs text-muted-foreground">
              {attemptId}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : !result ? (
          <p className="text-sm text-muted-foreground">Result not found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Score summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {result.marksObtained}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{result.totalMarks}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {result.accuracy.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rank / Percentile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {result.rank ?? "—"}
                    {result.percentile != null && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {result.percentile.toFixed(1)}%ile
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Time Taken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {fmt(result.timeTakenSecs)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Q breakdown */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Correct
                    </span>
                    <Badge variant="default">{result.correctCount}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Incorrect
                    </span>
                    <Badge variant="destructive">{result.incorrectCount}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Unattempted
                    </span>
                    <Badge variant="secondary">{result.unattemptedCount}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section breakdown */}
            {Object.keys(result.sectionBreakdown).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Section Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {Object.entries(result.sectionBreakdown).map(
                      ([section, data]) => (
                        <div
                          key={section}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <span className="font-medium">{section}</span>
                          <div className="flex gap-4 text-muted-foreground">
                            <span>{data.correct} correct</span>
                            <span>{data.marks} marks</span>
                            <span>{fmt(data.timeSecs)}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Topic breakdown */}
            {Object.keys(result.topicBreakdown).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Topic Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {Object.entries(result.topicBreakdown).map(
                      ([topic, data]) => (
                        <div
                          key={topic}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <span className="font-medium">{topic}</span>
                          <div className="flex gap-3 text-muted-foreground">
                            <span className="text-green-600 dark:text-green-400">
                              +{data.correct}
                            </span>
                            <span className="text-destructive">
                              -{data.wrong}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  )
}
