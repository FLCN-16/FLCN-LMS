"use client"

import { useEffect } from "react"
import { Button } from "@flcn-lms/ui/components/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TestError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for monitoring
    console.error("Test error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Test Error
        </h1>
        <p className="text-lg text-muted-foreground">
          We encountered an issue while processing your test.
        </p>
        <p className="text-sm text-muted-foreground">
          {error?.message || "Please try again or contact support if the problem persists."}
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
          <Button
            onClick={() => {
              // Navigate back to previous page or dashboard
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back()
              } else {
                window.location.href = "/"
              }
            }}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
