"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { Time03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@flcn-lms/ui/components/button"
import {
  TestTimePauseEvent,
  TestTimeResumeEvent,
} from "@/lib/test-timer-events"

function TestTimerAction() {
  const [isRunning, setIsRunning] = useState(false)
  const t = useTranslations("test.header")

  useEffect(() => {
    const handleTimerEvent = (e: Event) => {
      setIsRunning(e.type === TestTimeResumeEvent.type)
    }

    document.addEventListener(TestTimeResumeEvent.type, handleTimerEvent)
    document.addEventListener(TestTimePauseEvent.type, handleTimerEvent)
    return () => {
      document.removeEventListener(TestTimeResumeEvent.type, handleTimerEvent)
      document.removeEventListener(TestTimePauseEvent.type, handleTimerEvent)
    }
  }, [])

  function toggleTimer() {
    if (isRunning) {
      document.dispatchEvent(TestTimePauseEvent)
    } else {
      document.dispatchEvent(TestTimeResumeEvent)
    }
  }

  if (isRunning) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="ml-auto rounded-xs"
        onClick={toggleTimer}
      >
        <HugeiconsIcon icon={Time03Icon} />
        <span>{t("pause")}</span>
      </Button>
    )
  }

  return (
    <Button size="lg" className="ml-auto rounded-xs" onClick={toggleTimer}>
      <HugeiconsIcon icon={Time03Icon} />
      <span>{t("resume")}</span>
    </Button>
  )
}

export default TestTimerAction
