"use client"

import dayjs from "dayjs"
import React from "react"

import { Card, CardContent } from "@flcn-lms/ui/components/card"
import { Text } from "@flcn-lms/ui/components/typography"

import useTimer from "@/hooks/use-timer"
import {
  TestTimeExpiredEvent,
  TestTimePauseEvent,
  TestTimeResumeEvent,
} from "@/lib/test-timer-events"

function TestTimer() {
  const { isRunning, isExpired, duration, resume, pause } = useTimer({
    startTimestamp: dayjs().toDate().getTime(),
    expiryTimestamp: dayjs().add(1, "hour").toDate().getTime(),
    autoStart: true,
  })

  React.useEffect(() => {
    document.dispatchEvent(isRunning ? TestTimeResumeEvent : TestTimePauseEvent)
  }, [isRunning])

  React.useEffect(() => {
    document.addEventListener(TestTimePauseEvent.type, () => pause())
    document.addEventListener(TestTimeResumeEvent.type, () => resume())

    return () => {
      document.removeEventListener(TestTimePauseEvent.type, () => pause())
      document.removeEventListener(TestTimeResumeEvent.type, () => resume())
    }
  }, [resume, pause])

  React.useEffect(() => {
    if (isExpired) {
      document.dispatchEvent(TestTimeExpiredEvent)
    }
  }, [isExpired])

  return (
    <Card className="py-8">
      <CardContent className="flex flex-col items-center gap-y-1">
        <Text className="font-semibold uppercase">Time Remaining</Text>
        <Text className="font-mono text-4xl font-semibold">{duration}</Text>
      </CardContent>
    </Card>
  )
}

export default TestTimer
