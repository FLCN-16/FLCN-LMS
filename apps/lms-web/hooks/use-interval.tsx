import { useEffect, useRef } from "react"

export default function useInterval(
  callback: () => void,
  delay: number | null
) {
  const callbacRef = useRef<null | (() => void)>(null)

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback
  })

  useEffect(() => {
    if (!delay) return () => {}

    const interval = setInterval(() => {
      if (typeof callbacRef.current === "function") {
        callbacRef.current()
      }
    }, delay)
    return () => clearInterval(interval)
  }, [delay])
}
