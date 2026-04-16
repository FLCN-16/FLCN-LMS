import { IconAlertTriangle, IconEye } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { useAttempts, useDisqualifyAttempt } from "@/queries/attempts";
const STATUS_VARIANT = {
    IN_PROGRESS: "secondary",
    SUBMITTED: "default",
    TIMED_OUT: "destructive",
    PAUSED: "outline",
};
function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
}
export default function AttemptsPage() {
    const { data: attempts = [], isLoading } = useAttempts();
    const disqualifyMutation = useDisqualifyAttempt();
    return (<>
      <Helmet>
        <title>Attempts — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Attempts</h2>
          <p className="text-sm text-muted-foreground">
            {attempts.length} total attempts
          </p>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Attempt #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tab Switches</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (<TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>) : attempts.length === 0 ? (<TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No attempts yet.
                  </TableCell>
                </TableRow>) : (attempts.map((a) => (<TableRow key={a.id} className={a.isDisqualified ? "opacity-50" : ""}>
                    <TableCell className="font-mono text-xs">
                      {a.userId.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {a.testId.slice(0, 8)}…
                    </TableCell>
                    <TableCell>{a.attemptNumber}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[a.status]}>
                        {a.status}
                      </Badge>
                      {a.isDisqualified && (<Badge variant="destructive" className="ml-1">
                          DQ
                        </Badge>)}
                    </TableCell>
                    <TableCell>
                      <span className={a.tabSwitchCount > 3
                ? "font-medium text-destructive"
                : ""}>
                        {a.tabSwitchCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(a.startedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.remainingTimeSecs != null
                ? fmt(a.remainingTimeSecs)
                : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {a.status === "SUBMITTED" && (<Button size="icon" variant="ghost" className="size-7" asChild>
                            <Link to={`/attempts/${a.id}/result`}>
                              <IconEye className="size-4"/>
                            </Link>
                          </Button>)}
                        {!a.isDisqualified && a.status === "IN_PROGRESS" && (<Button size="icon" variant="ghost" className="size-7 text-destructive hover:text-destructive" title="Disqualify" onClick={() => disqualifyMutation.mutate({ attemptId: a.id })}>
                            <IconAlertTriangle className="size-4"/>
                          </Button>)}
                      </div>
                    </TableCell>
                  </TableRow>)))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>);
}
