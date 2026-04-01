import { getTranslations } from "next-intl/server"
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

interface TestAttempt {
  id: string
  testSlug: string
  testName: string
  attemptedAt: string
  score?: number
  totalScore: number
  status: "completed" | "in-progress" | "not-started"
  duration?: number // in minutes
  passedRequired?: boolean
}

// Mock data - replace with actual API call
const mockTestAttempts: TestAttempt[] = [
  {
    id: "1",
    testSlug: "midterm-exam",
    testName: "Midterm Examination",
    attemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    score: 85,
    totalScore: 100,
    status: "completed",
    duration: 45,
    passedRequired: true,
  },
  {
    id: "2",
    testSlug: "module-1-quiz",
    testName: "Module 1 Quiz",
    attemptedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    score: 92,
    totalScore: 100,
    status: "completed",
    duration: 20,
    passedRequired: true,
  },
  {
    id: "3",
    testSlug: "final-project",
    testName: "Final Project Assessment",
    attemptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    score: 78,
    totalScore: 100,
    status: "completed",
    duration: 120,
    passedRequired: false,
  },
]

function getStatusColor(status: TestAttempt["status"]) {
  switch (status) {
    case "completed":
      return "default"
    case "in-progress":
      return "secondary"
    case "not-started":
      return "outline"
    default:
      return "default"
  }
}

function getScoreColor(score: number, total: number): string {
  const percentage = (score / total) * 100
  if (percentage >= 80) return "text-green-600"
  if (percentage >= 60) return "text-yellow-600"
  return "text-red-600"
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export async function generateMetadata() {
  const t = await getTranslations("testHistory")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function TestHistoryPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>
}) {
  const t = await getTranslations("testHistory")
  const { tenantSlug } = await params

  // TODO: Replace with actual API call
  // const testAttempts = await fetchStudentTestAttempts(studentId)
  const testAttempts = mockTestAttempts

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("stats.totalAttempts")}
            </p>
            <p className="text-3xl font-bold">{testAttempts.length}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("stats.completed")}
            </p>
            <p className="text-3xl font-bold">
              {testAttempts.filter((a) => a.status === "completed").length}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("stats.averageScore")}
            </p>
            <p className="text-3xl font-bold">
              {testAttempts.length > 0
                ? Math.round(
                    testAttempts.reduce((acc, a) => acc + (a.score || 0), 0) /
                      testAttempts.filter((a) => a.score !== undefined).length
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Test Attempts Table */}
      <div className="rounded-lg border">
        {testAttempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">{t("empty")}</p>
            <Button asChild variant="outline">
              <Link href={`/${tenantSlug}/panel/library`}>
                {t("browseTests")}
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.testName")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead className="text-right">{t("table.score")}</TableHead>
                <TableHead>{t("table.duration")}</TableHead>
                <TableHead className="text-center">{t("table.status")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell className="font-medium">{attempt.testName}</TableCell>
                  <TableCell>{formatDate(attempt.attemptedAt)}</TableCell>
                  <TableCell className="text-right">
                    {attempt.score !== undefined ? (
                      <span
                        className={`font-semibold ${getScoreColor(
                          attempt.score,
                          attempt.totalScore
                        )}`}
                      >
                        {attempt.score}/{attempt.totalScore}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {attempt.duration ? `${attempt.duration} min` : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusColor(attempt.status)}>
                      {t(`status.${attempt.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {attempt.status === "completed" && (
                        <Button asChild size="sm" variant="ghost">
                          <Link
                            href={`/${tenantSlug}/panel/test/${attempt.testSlug}/result`}
                          >
                            {t("viewResult")}
                          </Link>
                        </Button>
                      )}
                      {attempt.status === "in-progress" && (
                        <Button asChild size="sm" variant="default">
                          <Link
                            href={`/${tenantSlug}/panel/test/${attempt.testSlug}/attempt`}
                          >
                            {t("continue")}
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
}
