import { Skeleton } from "@flcn-lms/ui/components/skeleton"

export default function TestAttemptLoading() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex gap-6 flex-1">
        {/* Sidebar Skeleton */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </aside>

        {/* Test Content Skeleton */}
        <div className="flex-1 space-y-6">
          {/* Question Skeleton */}
          <div className="space-y-4 rounded-lg border p-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Options Skeleton */}
          <div className="space-y-3 rounded-lg border p-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3 justify-end">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
