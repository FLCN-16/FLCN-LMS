import { Star } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface CourseReviewsProps {
  averageRating?: number
  reviewCount?: number
}

export default function CourseReviewsSection({
  averageRating,
  reviewCount,
}: CourseReviewsProps) {
  const filledStars = Math.round(averageRating ?? 0)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">Course Reviews</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Overall Rating */}
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border/40 p-6">
          <div className="text-5xl font-bold text-accent">
            {averageRating != null ? averageRating.toFixed(1) : "—"}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <HugeiconsIcon
                key={i}
                icon={Star}
                className={
                  i < filledStars
                    ? "h-5 w-5 fill-accent text-accent"
                    : "h-5 w-5 text-muted-foreground"
                }
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviewCount?.toLocaleString() ?? 0} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex flex-col gap-4 md:col-span-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="w-12 text-sm font-medium text-muted-foreground">
                {rating}★
              </span>
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${rating * 20}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-muted-foreground">
                {rating * 200}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border/40 p-4">
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Completion Rate
          </div>
          <div className="text-2xl font-bold text-foreground">95%</div>
        </div>
        <div className="rounded-lg border border-border/40 p-4">
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Students
          </div>
          <div className="text-2xl font-bold text-foreground">
            {reviewCount != null ? reviewCount.toLocaleString() : "—"}
          </div>
        </div>
        <div className="rounded-lg border border-border/40 p-4">
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Job Placements
          </div>
          <div className="text-2xl font-bold text-foreground">78%</div>
        </div>
        <div className="rounded-lg border border-border/40 p-4">
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Certificate Value
          </div>
          <div className="text-2xl font-bold text-foreground">★★★★★</div>
        </div>
      </div>
    </div>
  )
}
