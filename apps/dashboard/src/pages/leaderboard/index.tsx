import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery, useMutation } from "@tanstack/react-query"
import { IconRefresh, IconTrophy } from "@tabler/icons-react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@flcn-lms/ui/components/table"

import { leaderboardApi } from "../../lib/api/attempts"
import { testSeriesApi } from "../../lib/api/test-series"

function fmt(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${s}s`
}

export default function LeaderboardPage() {
  const [selectedTestId, setSelectedTestId] = useState<string>("")

  const { data: allSeries = [] } = useQuery({
    queryKey: ["test-series"],
    queryFn: () => testSeriesApi.list(),
  })

  // Flatten all tests from all series for the selector
  const { data: tests = [] } = useQuery({
    queryKey: ["all-tests"],
    queryFn: async () => {
      const results = await Promise.all(
        allSeries.map((s) => testSeriesApi.listTests(s.id)),
      )
      return results.flat()
    },
    enabled: allSeries.length > 0,
  })

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ["leaderboard", selectedTestId],
    queryFn: () => leaderboardApi.getTopN(selectedTestId),
    enabled: !!selectedTestId,
  })

  const recomputeMutation = useMutation({
    mutationFn: () => leaderboardApi.recompute(selectedTestId),
    onSuccess: () => refetch(),
  })

  return (
    <>
      <Helmet>
        <title>Leaderboard — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              {selectedTestId ? `${entries.length} entries` : "Select a test to view rankings"}
            </p>
          </div>
          {selectedTestId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => recomputeMutation.mutate()}
              disabled={recomputeMutation.isPending}
            >
              <IconRefresh className={`size-4 ${recomputeMutation.isPending ? "animate-spin" : ""}`} />
              Recompute
            </Button>
          )}
        </div>

        {/* Test selector */}
        <div className="mb-4 max-w-sm">
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          >
            <option value="">— Select a test —</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {selectedTestId && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Percentile</TableHead>
                  <TableHead>Time Taken</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No entries yet. Submit attempts and recompute.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        {e.rank <= 3 ? (
                          <span className="flex items-center gap-1 font-bold">
                            <IconTrophy
                              className={`size-4 ${
                                e.rank === 1
                                  ? "text-yellow-500"
                                  : e.rank === 2
                                    ? "text-slate-400"
                                    : "text-amber-600"
                              }`}
                            />
                            {e.rank}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{e.rank}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{e.userId.slice(0, 12)}…</TableCell>
                      <TableCell className="font-medium">{e.marksObtained}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{e.percentile.toFixed(1)}%ile</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{fmt(e.timeTakenSecs)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(e.updatedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}
