import Link from "next/link"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Progress } from "@flcn-lms/ui/components/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@flcn-lms/ui/components/table"

interface TestResultPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ attemptId?: string }>
}

// Mock result for demonstration
async function TestResultPage({ params, searchParams }: TestResultPageProps) {
  const { slug } = await params
  const { attemptId } = await searchParams

  // In a real app, we would fetch the result using attemptId
  // const result = await getAttemptResult(testId, attemptId)

  // Mock data for demonstration
  const mockResult = {
    totalMarks: 100,
    marksObtained: 78,
    correctCount: 39,
    incorrectCount: 8,
    unattemptedCount: 3,
    accuracy: 82.98,
    timeTakenSecs: 1800,
    percentile: 85,
    passThreshold: 60,
  }

  const accuracy = mockResult.marksObtained / mockResult.totalMarks
  const isPassed = mockResult.marksObtained >= mockResult.passThreshold
  const totalQuestions =
    mockResult.correctCount +
    mockResult.incorrectCount +
    mockResult.unattemptedCount

  const minutes = Math.floor(mockResult.timeTakenSecs / 60)
  const seconds = mockResult.timeTakenSecs % 60

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Test Result</h1>
        <p className="mt-1 text-muted-foreground">
          View your test performance and detailed analysis
        </p>
      </div>

      {/* Score Card */}
      <Card className="p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Score summary */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Your Score
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">
                  {mockResult.marksObtained}
                </span>
                <span className="text-2xl text-muted-foreground">
                  / {mockResult.totalMarks}
                </span>
              </div>
              <Badge
                variant={isPassed ? "default" : "destructive"}
                className="text-base px-3 py-1"
              >
                {isPassed ? "✓ Passed" : "✗ Failed"}
              </Badge>
            </div>

            {/* Meta info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">
                  {mockResult.accuracy.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Percentile</span>
                <span className="font-medium">{mockResult.percentile}th</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Taken</span>
                <span className="font-medium">
                  {minutes}m {seconds}s
                </span>
              </div>
            </div>
          </div>

          {/* Right: Progress visualization */}
          <div className="space-y-6">
            {/* Score progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Score Progress</span>
                <span className="text-sm font-medium">
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={accuracy * 100} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Pass threshold: {mockResult.passThreshold} marks
              </p>
            </div>

            {/* Question breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {mockResult.correctCount}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Correct
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {mockResult.incorrectCount}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Incorrect
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                  {mockResult.unattemptedCount}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Skipped
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Section Breakdown</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead className="text-right">Questions</TableHead>
                <TableHead className="text-right">Correct</TableHead>
                <TableHead className="text-right">Marks</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Physics</TableCell>
                <TableCell className="text-right">30</TableCell>
                <TableCell className="text-right">24</TableCell>
                <TableCell className="text-right">60</TableCell>
                <TableCell className="text-right">80%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chemistry</TableCell>
                <TableCell className="text-right">25</TableCell>
                <TableCell className="text-right">15</TableCell>
                <TableCell className="text-right">18</TableCell>
                <TableCell className="text-right">60%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/user/test-history">View All Tests</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/user/library">Back to Library</Link>
        </Button>
      </div>
    </div>
  )
}

export default TestResultPage
