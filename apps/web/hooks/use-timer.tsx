import dayjs from "dayjs"
import { useCallback, useState } from "react"

import {
  expiryTimestamp,
  getSecondsFromExpiry,
  getTimeFromSeconds,
} from "@/lib/time"

import useInterval from "./use-interval"

interface UseTimerOptions {
  startTimestamp: number
  expiryTimestamp: number
  onTimeExpire?: () => void
  onRangeChange?: (
    isInRange: boolean,
    currentTimestamp: number,
    startTimestamp: number,
    expiryTimestamp: number
  ) => void
  startTimestampMargin?: number
  endTimestampMargin?: number
  onMarginRangeChange?: (
    isInMarginRange: boolean,
    currentTimestamp: number,
    startTimestamp: number,
    expiryTimestamp: number
  ) => void
  autoStart?: boolean
}

const DEFAULT_DELAY = 1000
function getDelayFromExpiryTimestamp(expiryTs: number) {
  if (!expiryTimestamp(expiryTs)) return null

  const seconds = getSecondsFromExpiry(expiryTs)
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000)
  return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY
}

export default function useTimer({
  startTimestamp,
  expiryTimestamp: expiry,
  onTimeExpire,
  onRangeChange,
  startTimestampMargin = 600, // Seconds
  endTimestampMargin = 600, // Seconds
  onMarginRangeChange,
  autoStart = true,
}: UseTimerOptions) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry)
  const [seconds, setSeconds] = useState(getSecondsFromExpiry(expiryTimestamp))
  const [isRunning, setIsRunning] = useState(autoStart)
  const [didStart, setDidStart] = useState(autoStart)
  const [isExpired, setIsExpired] = useState(
    getSecondsFromExpiry(expiryTimestamp) <= 0
  )
  const [isInRange, setIsInRange] = useState(false)
  const [isInMarginRange, setIsInMarginRange] = useState(false)
  const [delay, setDelay] = useState(
    getDelayFromExpiryTimestamp(expiryTimestamp)
  )

  const handleExpire = useCallback(() => {
    if (onTimeExpire) onTimeExpire()

    setIsRunning(false)
    setIsExpired(true)
    setDelay(null)
  }, [onTimeExpire])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const restart = useCallback(
    (newExpiryTimestamp: number, newAutoStart = true) => {
      setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp))
      setDidStart(newAutoStart)
      setIsRunning(newAutoStart)
      setExpiryTimestamp(newExpiryTimestamp)
      setSeconds(getSecondsFromExpiry(newExpiryTimestamp))
    },
    []
  )

  const resume = useCallback(() => {
    const time = new Date()
    time.setMilliseconds(time.getMilliseconds() + seconds * 1000)
    restart(time.getTime())
  }, [seconds, restart])

  const start = useCallback(() => {
    if (didStart) {
      setSeconds(getSecondsFromExpiry(expiryTimestamp))
      setIsRunning(true)
    } else {
      resume()
    }
  }, [expiryTimestamp, didStart, resume])

  useInterval(
    () => {
      const currentTimestamp = parseInt(dayjs().format("x"), 10)
      setIsInMarginRange((prev) => {
        const current =
          startTimestamp - startTimestampMargin * 1000 < currentTimestamp &&
          currentTimestamp < expiryTimestamp + endTimestampMargin * 1000
        if (prev !== current && typeof onMarginRangeChange === "function") {
          onMarginRangeChange(
            current,
            currentTimestamp,
            startTimestamp,
            expiryTimestamp
          )
        }

        return current
      })

      setIsInRange((prev) => {
        const current =
          startTimestamp < currentTimestamp &&
          currentTimestamp < expiryTimestamp
        if (prev !== current && typeof onRangeChange === "function") {
          onRangeChange(
            current,
            currentTimestamp,
            startTimestamp,
            expiryTimestamp
          )
        }

        return current
      })

      if (delay !== DEFAULT_DELAY) {
        setDelay(DEFAULT_DELAY)
      }

      const secondsValue = getSecondsFromExpiry(expiryTimestamp)
      setSeconds(secondsValue)
      if (secondsValue <= 0) {
        handleExpire()
      }
    },
    isRunning ? delay : null
  )

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    resume,
    restart,
    isRunning,
    isExpired,
    isInRange,
    isInMarginRange,
    setExpiryTimestamp,
  }
}
