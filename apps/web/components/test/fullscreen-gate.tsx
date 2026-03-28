"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon, ArrowDiagonalIcon } from "@hugeicons/core-free-icons"

import useForceFullscreen from "@/hooks/use-fullscreen"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Separator } from "@workspace/ui/components/separator"

import {
  TestTimePauseEvent,
  TestTimeResumeEvent,
} from "@/lib/test-timer-events"

interface FullscreenGateProps {
  children: React.ReactNode
}

function FullscreenGate({ children }: FullscreenGateProps) {
  const { isFullscreen, hasExited, enterFullscreen } = useForceFullscreen({
    onEnter: () => {
      document.dispatchEvent(TestTimeResumeEvent)
    },
    onExit: () => {
      document.dispatchEvent(TestTimePauseEvent)
    },
  })

  return (
    <>
      {children}

      <Dialog open={!isFullscreen}>
        {/* Prevent closing by clicking outside or pressing Escape */}
        <DialogContent
          className="max-w-sm"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${hasExited ? "bg-destructive/10" : "bg-primary/10"}`}
              >
                <HugeiconsIcon
                  icon={hasExited ? Alert01Icon : ArrowDiagonalIcon}
                  size={18}
                  color={
                    hasExited
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--primary))"
                  }
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-sm leading-none font-semibold">
                  {hasExited ? "Fullscreen Exited" : "Fullscreen Required"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs">
                  {hasExited ? "Test paused" : "Before you begin"}
                </DialogDescription>
              </div>
              {hasExited && (
                <Badge variant="destructive" className="text-xs">
                  Violation
                </Badge>
              )}
            </div>
          </DialogHeader>

          <Separator />

          <div className="space-y-3">
            {hasExited ? (
              <Alert
                variant="destructive"
                className="border-destructive/20 bg-destructive/5 py-2"
              >
                <AlertDescription className="text-xs">
                  Exiting fullscreen is a violation and has been logged.
                  Re-enter to resume your test.
                </AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-2">
                {[
                  "Do not exit fullscreen during the test",
                  "Pressing Esc or switching tabs will pause the test",
                  "Violations are logged and may affect your result",
                ].map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                    {rule}
                  </li>
                ))}
              </ul>
            )}

            <Button className="w-full rounded-xs" onClick={enterFullscreen}>
              <HugeiconsIcon
                icon={ArrowDiagonalIcon}
                size={14}
                color="currentColor"
                strokeWidth={2}
              />
              {hasExited
                ? "Re-enter Fullscreen & Resume"
                : "Enter Fullscreen & Start Test"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FullscreenGate
