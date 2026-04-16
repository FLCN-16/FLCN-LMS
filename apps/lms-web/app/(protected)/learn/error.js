"use client";
import { useEffect } from "react";
import { Button } from "@flcn-lms/ui/components/button";
export default function LearnError({ error, reset }) {
    useEffect(() => {
        // Log error to monitoring service
        console.error("Learn section error:", error);
    }, [error]);
    return (<div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Course Loading Error
        </h1>
        <p className="text-lg text-muted-foreground">
          We couldn't load your course content.
        </p>
        <p className="text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.history.back()} variant="outline">
            Go back
          </Button>
        </div>
      </div>
    </div>);
}
