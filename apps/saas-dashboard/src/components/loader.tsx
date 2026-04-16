"use client"

import { useEffect, useState } from "react"

import { LayoutDashboard } from "lucide-react"

import { cn } from "@flcn-lms/ui/lib/utils"

// ─── Loading steps ────────────────────────────────────────────────────────────
const STEPS = [
  { at: 0, label: "Initializing…" },
  { at: 400, label: "Authenticating…" },
  { at: 1200, label: "Fetching data…" },
  { at: 1800, label: "Preparing dashboard…" },
  { at: 2500, label: "Almost ready…" },
]

export function AppLoader() {
  const [label, setLabel] = useState(STEPS[0].label)

  useEffect(() => {
    const timers = STEPS.slice(1).map(({ at, label: l }) =>
      setTimeout(() => setLabel(l), at)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      role="status"
      aria-label="Loading admin panel"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-5",
        "bg-background transition-[opacity,visibility] duration-400",
        "visible opacity-100"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 text-foreground">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
          <LayoutDashboard size={18} />
        </div>
        <span className="text-base font-semibold tracking-tight">FLCN LMS</span>
      </div>

      {/* Spinner + bar + label */}
      <div className="flex flex-col items-center gap-3">
        {/* Ring spinner */}
        <div
          aria-hidden="true"
          className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground"
        />

        {/* Progress bar */}
        <div className="h-0.5 w-40 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full w-full rounded-full bg-foreground",
              "animate-[progress_2s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            )}
          />
        </div>

        <p className="text-xs tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
