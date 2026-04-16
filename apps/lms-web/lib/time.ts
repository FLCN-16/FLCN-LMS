export const expiryTimestamp = (ts: number) => new Date(ts).getTime() > 0

export const onTimerExpire = (onExpire: () => void) =>
  onExpire && typeof onExpire === "function"

export const getTimeFromSeconds = (secs: number) => {
  const totalSeconds = Math.ceil(secs)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
    .toString()
    .padStart(2, "0")
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
    .toString()
    .padStart(2, "0")
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
    .toString()
    .padStart(2, "0")
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0")

  return {
    seconds,
    minutes,
    hours,
    days,
    duration: `${hours}:${minutes}:${seconds}`,
  }
}

export const getSecondsFromExpiry = (
  expiry: number,
  shouldRound: boolean = false
) => {
  const now = new Date().getTime()
  const milliSecondsDistance = expiry - now
  if (milliSecondsDistance > 0) {
    const val = milliSecondsDistance / 1000
    return shouldRound ? Math.round(val) : val
  }
  return 0
}
