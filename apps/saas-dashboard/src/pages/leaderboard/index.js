import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { IconRefresh, IconTrophy } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { useLeaderboardTopN, useRecomputeLeaderboard } from "@/queries/attempts";
import { useTestSeriesList, useTestsListQuery } from "@/queries/test-series";
function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
}
export default function LeaderboardPage() {
    const [selectedTestId, setSelectedTestId] = useState("");
    const { data: allSeries = [] } = useTestSeriesList();
    const recomputeMutation = useRecomputeLeaderboard();
    const testsQueries = useQueries({
        queries: allSeries.map((series) => ({
            queryKey: useTestsListQuery.getKey({ seriesId: series.id }),
            queryFn: () => useTestsListQuery.fetcher({ seriesId: series.id }),
            enabled: allSeries.length > 0,
        })),
        combine: (results) => ({
            data: results.flatMap((result) => result.data ?? []),
        }),
    });
    const { data: entries = [], isLoading } = useLeaderboardTopN({
        variables: { testId: selectedTestId },
        enabled: !!selectedTestId,
    });
    return (<>
      <Helmet>
        <title>Leaderboard — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              {selectedTestId
            ? `${entries.length} entries`
            : "Select a test to view rankings"}
            </p>
          </div>
          {selectedTestId && (<Button size="sm" variant="outline" onClick={() => recomputeMutation.mutate({ testId: selectedTestId })} disabled={recomputeMutation.isPending}>
              <IconRefresh className={`size-4 ${recomputeMutation.isPending ? "animate-spin" : ""}`}/>
              Recompute
            </Button>)}
        </div>

        <div className="mb-4 max-w-sm">
          <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs">
            <option value="">— Select a test —</option>
            {testsQueries.data.map((test) => (<option key={test.id} value={test.id}>
                {test.title}
              </option>))}
          </select>
        </div>

        {selectedTestId && (<div className="rounded-lg border">
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
                {isLoading ? (<TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>) : entries.length === 0 ? (<TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No entries yet. Submit attempts and recompute.
                    </TableCell>
                  </TableRow>) : (entries.map((entry) => (<TableRow key={entry.id}>
                      <TableCell>
                        {entry.rank <= 3 ? (<span className="flex items-center gap-1 font-bold">
                            <IconTrophy className={`size-4 ${entry.rank === 1
                        ? "text-yellow-500"
                        : entry.rank === 2
                            ? "text-slate-400"
                            : "text-amber-600"}`}/>
                            {entry.rank}
                          </span>) : (<span className="text-muted-foreground">
                            {entry.rank}
                          </span>)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.userId.slice(0, 12)}…
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.marksObtained}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {entry.percentile.toFixed(1)}%ile
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {fmt(entry.timeTakenSecs)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>)))}
              </TableBody>
            </Table>
          </div>)}
      </div>
    </>);
}
