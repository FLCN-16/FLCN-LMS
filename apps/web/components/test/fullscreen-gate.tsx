"use client"

import { Alert01Icon, ArrowDiagonalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { Alert, AlertDescription } from "@flcn-lms/ui/components/alert"
import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@flcn-lms/ui/components/dialog"
import { Separator } from "@flcn-lms/ui/components/separator"

import useForceFullscreen from "@/hooks/use-fullscreen"
import {
  TestTimePauseEvent,
  TestTimeResumeEvent,
} from "@/lib/test-timer-events"

interface FullscreenGateProps {
  children: React.ReactNode
}

function FullscreenGate({ children }: FullscreenGateProps) {
  const t = useTranslations("test.fullscreen")
  const { isFullscreen, hasExited, enterFullscreen } = useForceFullscreen({
    onEnter: () => {
      document.dispatchEvent(TestTimeResumeEvent)
    },
    onExit: () => {
      document.dispatchEvent(TestTimePauseEvent)
    },
  })

  const rules = [t("ruleNoExit"), t("rulePressEsc"), t("ruleViolations")]

  return (
    <>
      {children}

      <Dialog open={!isFullscreen}>
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
                  {hasExited ? t("exitedTitle") : t("requiredTitle")}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs">
                  {hasExited ? t("exitedSubtitle") : t("requiredSubtitle")}
                </DialogDescription>
              </div>
              {hasExited && (
                <Badge variant="destructive" className="text-xs">
                  {t("violation")}
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
                  {t("violationAlert")}
                </AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-2">
                {rules.map((rule) => (
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
              {hasExited ? t("reEnterAndResume") : t("enterAndStart")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FullscreenGate
