"use client";
import { Alert01Icon, ArrowDiagonalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription } from "@flcn-lms/ui/components/alert";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@flcn-lms/ui/components/dialog";
import { Separator } from "@flcn-lms/ui/components/separator";
import useForceFullscreen from "@/hooks/use-fullscreen";
import { TestTimePauseEvent, TestTimeResumeEvent, } from "@/lib/test-timer-events";
function FullscreenGate({ children }) {
    const { isFullscreen, hasExited, enterFullscreen } = useForceFullscreen({
        onEnter: () => {
            document.dispatchEvent(TestTimeResumeEvent);
        },
        onExit: () => {
            document.dispatchEvent(TestTimePauseEvent);
        },
    });
    const rules = [
        "Do not exit fullscreen mode during the test",
        "Do not press Escape key to exit",
        "Violations will be recorded and may impact your score",
    ];
    return (<>
      {children}

      <Dialog open={!isFullscreen}>
        <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${hasExited ? "bg-destructive/10" : "bg-primary/10"}`}>
                <HugeiconsIcon icon={hasExited ? Alert01Icon : ArrowDiagonalIcon} size={18} color={hasExited
            ? "hsl(var(--destructive))"
            : "hsl(var(--primary))"} strokeWidth={1.5}/>
              </div>
              <div className="flex-1">
                <DialogTitle className="text-sm leading-none font-semibold">
                  {hasExited ? "Test Exited" : "Fullscreen Required"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs">
                  {hasExited
            ? "You have exited fullscreen. Your test has been paused."
            : "Enter fullscreen mode to continue with the test."}
                </DialogDescription>
              </div>
              {hasExited && (<Badge variant="destructive" className="text-xs">
                  Violation
                </Badge>)}
            </div>
          </DialogHeader>

          <Separator />

          <div className="space-y-3">
            {hasExited ? (<Alert variant="destructive" className="border-destructive/20 bg-destructive/5 py-2">
                <AlertDescription className="text-xs">
                  A fullscreen violation has been recorded. Continuing will
                  affect your score.
                </AlertDescription>
              </Alert>) : (<ul className="space-y-2">
                {rules.map((rule) => (<li key={rule} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40"/>
                    {rule}
                  </li>))}
              </ul>)}

            <Button className="w-full rounded-xs" onClick={enterFullscreen}>
              <HugeiconsIcon icon={ArrowDiagonalIcon} size={14} color="currentColor" strokeWidth={2}/>
              {hasExited ? "Re-enter & Resume" : "Enter & Start"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>);
}
export default FullscreenGate;
