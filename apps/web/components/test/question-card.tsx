"use client"

import { useEffect, useState } from "react"

import { CheckSquare, Square } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@flcn-lms/ui/components/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@flcn-lms/ui/components/item"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import {
  TestTimePauseEvent,
  TestTimeResumeEvent,
} from "@/lib/test-timer-events"

import { cn } from "@flcn-lms/ui/lib/utils"

interface QuestionAnswerProps {
  answer: string
  isCorrect?: boolean
}

function QuestionAnswer({ answer, isCorrect }: QuestionAnswerProps) {
  const isSelected = true

  return (
    <Item
      variant="outline"
      size="default"
      className={cn(
        "cursor-pointer rounded-sm bg-inherit",
        isCorrect && "bg-blue-500 text-white"
      )}
    >
      <ItemMedia>
        <HugeiconsIcon
          icon={isSelected ? CheckSquare : Square}
          className="size-5"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{answer}</ItemTitle>
      </ItemContent>
    </Item>
  )
}

function TestQuestionCard() {
  const [blurQuestion, setBlurQuestion] = useState(false)

  useEffect(() => {
    document.addEventListener(TestTimePauseEvent.type, () =>
      setBlurQuestion(true)
    )
    document.addEventListener(TestTimeResumeEvent.type, () =>
      setBlurQuestion(false)
    )
    return () => {
      document.removeEventListener(TestTimePauseEvent.type, () =>
        setBlurQuestion(true)
      )
      document.removeEventListener(TestTimeResumeEvent.type, () =>
        setBlurQuestion(false)
      )
    }
  }, [blurQuestion])

  return (
    <Card
      className={cn(
        "rounded px-6 py-8 transition-all duration-300 select-none",
        { "blur-sm": blurQuestion }
      )}
    >
      <CardHeader className="border-b">
        <CardTitle>Question 14 of 100</CardTitle>
        <CardAction className="space-x-2">
          <Badge>+2.0</Badge>
          <Badge variant="destructive">-1.0</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="mt-4">
        <Heading variant="h1" className="font-mono font-medium">
          With reference to the Constitution of India, consider the following
          statements regarding the Directive Principles of State Policy (DPSP):
        </Heading>

        <div className="mt-4 flex flex-col gap-y-2">
          <Text className="font-semibold">Instructions:</Text>

          <div className="rounded-xs border-l-4 p-2">
            1. They are fundamental in the governance of the country and it
            shall be the duty of the State to apply these principles in making
            laws.
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-y-2 border-t-0 bg-transparent">
        <QuestionAnswer answer="1 & 3 only" isCorrect />
        <QuestionAnswer answer="2 Only" />
      </CardFooter>
    </Card>
  )
}

export default TestQuestionCard
