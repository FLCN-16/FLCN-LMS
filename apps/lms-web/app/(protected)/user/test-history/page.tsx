import Link from "next/link"

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
import type { AttemptStatus } from "@flcn-lms/types/attempts"

export const dynamic = "force-dynamic"
import { getAllUserAttempts } from "@/fetchers/attempts"

function getStatusColor(
  status: AttemptStatus
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "SUBMITTED":
      return "default"
    case "IN_PROGRESS":
      return "secondary"
    case "PAUSED":
      return "outline"
    case "TIMED_OUT":
      return "destructive"
    default:
      return "default"
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getStatusLabel(status: AttemptStatus): string {
  switch (status) {
    case "SUBMITTED":
      return "Submitted"
    case "IN_PROGRESS":
      return "In Progress"
    case "PAUSED":
      return "Paused"
    case "TIMED_OUT":
      return "Timed Out"
    default:
      return status
  }
}

export async function generateMetadata() {
  return {
    title: "Test History",
    description: "View your test attempt history",
  }
}

export default async function TestHistoryPage() {
  try {
    const testAttempts = await getAllUserAttempts()

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Test History</h1>
          <p className="text-muted-foreground">
            View your test attempt history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Attempts
              </p>
              <p className="text-3xl font-bold">{testAttempts.length}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-3xl font-bold">
                {testAttempts.filter((a) => a.status === "SUBMITTED").length}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                In Progress
              </p>
              <p className="text-3xl font-bold">
                {testAttempts.filter((a) => a.status === "IN_PROGRESS").length}
              </p>
            </div>
          </div>
        </div>

        {/* Test Attempts Table */}
        <div className="rounded-lg border">
          {testAttempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">No test attempts yet</p>
              <Button asChild variant="outline">
                <Link href="/test-series">Browse Test Series</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attempt Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">
                      Attempt {attempt.attemptNumber}
                    </TableCell>
                    <TableCell>{formatDate(attempt.startedAt)}</TableCell>
                    <TableCell className="text-right">
                      {attempt.remainingTimeSecs
                        ? `${Math.round(attempt.remainingTimeSecs / 60)} min`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(attempt.status)}>
                        {getStatusLabel(attempt.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {attempt.status === "SUBMITTED" && (
                          <Button asChild size="sm" variant="ghost">
                            <Link
                              href={`/panel/tests/${attempt.testId}/attempts/${attempt.id}/result`}
                            >
                              View Result
                            </Link>
                          </Button>
                        )}
                        {attempt.status === "IN_PROGRESS" && (
                          <Button asChild size="sm" variant="default">
                            <Link
                              href={`/panel/tests/${attempt.testId}/attempts/${attempt.id}`}
                            >
                              Continue
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching test attempts:", error)
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Test History</h1>
          <p className="text-muted-foreground">
            View your test attempt history
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-center text-red-600">
          <p>Failed to load test history</p>
        </div>
      </div>
    )
  }
}
