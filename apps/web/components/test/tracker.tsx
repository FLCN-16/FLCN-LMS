"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card"
import { Text } from "@workspace/ui/components/typography"
import { cn } from "@workspace/ui/lib/utils"

enum QuestionStatus {
  Answered = "answered",
  Unanswered = "unanswered",
  ForReview = "for-review",
}

interface QuestionIndexProps {
  status?: QuestionStatus
  isCurrent?: boolean
  children: React.ReactNode
}

function QuestionIndex({
  status = QuestionStatus.Unanswered,
  isCurrent,
  children,
}: QuestionIndexProps) {
  return (
    <div
      className={cn(
        "flex size-14 cursor-pointer items-center justify-center rounded-xs text-xl font-semibold",
        {
          "bg-green-500": status === QuestionStatus.Answered,
          "bg-gray-600 text-white": status === QuestionStatus.Unanswered,
          "bg-blue-600 text-white": status === QuestionStatus.ForReview,
          "border-2 border-gray-600 bg-gray-200 text-black": isCurrent,
        }
      )}
    >
      <span>{children}</span>
    </div>
  )
}

function TestTracker() {
  return (
    <Card className="px-4">
      <CardHeader className="grid grid-cols-2 gap-4 py-6 font-mono">
        <div className="flex items-center gap-x-3">
          <div className="size-4 rounded-xs bg-green-500" />
          <Text>Answered</Text>
        </div>

        <div className="flex items-center gap-x-3">
          <div className="size-4 rounded-xs bg-gray-600" />
          <Text>Unanswered</Text>
        </div>

        <div className="flex items-center gap-x-3">
          <div className="size-4 rounded-xs bg-blue-600" />
          <Text>For Review</Text>
        </div>

        <div className="flex items-center gap-x-3">
          <div className="size-4 rounded-xs border border-gray-600 bg-gray-200" />
          <Text>Current</Text>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-5 justify-between gap-3 font-mono">
        <QuestionIndex status={QuestionStatus.Answered}>1</QuestionIndex>
        <QuestionIndex status={QuestionStatus.Unanswered}>2</QuestionIndex>
        <QuestionIndex status={QuestionStatus.ForReview}>3</QuestionIndex>
        <QuestionIndex isCurrent>4</QuestionIndex>
        <QuestionIndex>5</QuestionIndex>
        <QuestionIndex status={QuestionStatus.Answered}>1</QuestionIndex>
        <QuestionIndex status={QuestionStatus.Unanswered}>2</QuestionIndex>
        <QuestionIndex status={QuestionStatus.ForReview}>3</QuestionIndex>
        <QuestionIndex isCurrent>4</QuestionIndex>
        <QuestionIndex>5</QuestionIndex>
      </CardContent>

      <CardFooter className="bg-transparent px-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="xl"
              className="w-full rounded-xs font-mono"
            >
              Submit Final Test
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to submit your final test. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="destructive" className="rounded-xs">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="rounded-xs">
                Sure, Submit Final Test
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

export default TestTracker
