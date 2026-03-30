// hooks/use-fullscreen.ts
import { useEffect, useState, useCallback, useRef } from "react"

interface UseForceFullscreenOptions {
  onExit?: () => void
  onEnter?: () => void
}

function useForceFullscreen({
  onExit,
  onEnter,
}: UseForceFullscreenOptions = {}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasExited, setHasExited] = useState(false)
  const isMounted = useRef(false) // ✅ track if listener has fired at least once

  const enterFullscreen = useCallback(async () => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>
    }
    try {
      await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())
    } catch (e) {
      console.error("Fullscreen failed:", e)
    }
  }, [])

  useEffect(() => {
    const onChange = () => {
      const inFullscreen = !!document.fullscreenElement
      setIsFullscreen(inFullscreen)

      if (inFullscreen) {
        isMounted.current = true
        onEnter?.()
      } else {
        // ✅ Only treat as "exit" if user was already in fullscreen this session
        if (isMounted.current) {
          setHasExited(true)
          onExit?.()
        }
      }
    }

    document.addEventListener("fullscreenchange", onChange)
    onChange() // sync initial state — won't trigger exit logic since isMounted = false
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [onExit, onEnter])

  return { isFullscreen, hasExited, enterFullscreen }
}

export default useForceFullscreen
