import Image from "next/image"
import Link from "next/link"
import { Star, Users, Clock, Award } from "lucide-react"

import { AspectRatio } from "@flcn-lms/ui/components/aspect-ratio"
import { Button } from "@flcn-lms/ui/components/button"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import { cn } from "@flcn-lms/ui/lib/utils"

import formatPrice from "@/lib/format-price"

interface CourseCardProps {
  id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  imageUrl: string
  level?: string
  estimatedHours?: number
  totalEnrolled?: number
  averageRating?: number
  reviewCount?: number
  certificateIncluded?: boolean
  instructorName?: string
  isFeatured?: boolean
}

function CourseCard({
  id,
  title,
  slug,
  price,
  discountPrice,
  imageUrl,
  level,
  estimatedHours,
  totalEnrolled,
  averageRating,
  reviewCount,
  certificateIncluded,
  instructorName,
  isFeatured,
}: CourseCardProps) {
  const hasDiscount = discountPrice && discountPrice < price
  const displayPrice = hasDiscount ? discountPrice : price

  return (
    <div
      className={cn(
        "group relative flex max-w-sm flex-col overflow-hidden rounded-lg border transition-all duration-200",
        "hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-700",
        "bg-white dark:bg-neutral-950"
      )}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 dark:bg-amber-950">
          <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Featured
          </span>
        </div>
      )}

      {/* Image */}
      <AspectRatio ratio={16 / 9} className="overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </AspectRatio>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        {/* Header Section */}
        <div className="space-y-2.5">
          {/* Level Badge */}
          {level && (
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {level}
            </span>
          )}

          {/* Title */}
          <Heading variant="h3" className="line-clamp-2 text-sm font-bold leading-snug">
            {title}
          </Heading>

          {/* Instructor */}
          {instructorName && (
            <Text className="text-xs text-neutral-500 dark:text-neutral-400">
              by {instructorName}
            </Text>
          )}
        </div>

        {/* Metadata Section - More Visible */}
        <div className="space-y-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          {/* Rating Row */}
          {averageRating !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < Math.round(averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300 dark:text-neutral-600"
                      )}
                    />
                  ))}
                </div>
                <Text className="text-xs font-semibold">
                  {averageRating.toFixed(1)}
                </Text>
              </div>
              {reviewCount !== undefined && reviewCount > 0 && (
                <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                  {reviewCount} reviews
                </Text>
              )}
            </div>
          )}

          {/* Course Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Duration */}
            {estimatedHours !== undefined && estimatedHours > 0 && (
              <div className="flex items-center gap-2 rounded bg-neutral-50 p-2 dark:bg-neutral-900">
                <Clock className="h-4 w-4 flex-shrink-0 text-neutral-600 dark:text-neutral-400" />
                <div className="min-w-0">
                  <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    {estimatedHours}h
                  </Text>
                  <Text className="text-xs text-neutral-500 dark:text-neutral-500">
                    duration
                  </Text>
                </div>
              </div>
            )}

            {/* Enrollment */}
            {totalEnrolled !== undefined && totalEnrolled > 0 && (
              <div className="flex items-center gap-2 rounded bg-neutral-50 p-2 dark:bg-neutral-900">
                <Users className="h-4 w-4 flex-shrink-0 text-neutral-600 dark:text-neutral-400" />
                <div className="min-w-0">
                  <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    {totalEnrolled > 1000 ? `${(totalEnrolled / 1000).toFixed(1)}k` : totalEnrolled}
                  </Text>
                  <Text className="text-xs text-neutral-500 dark:text-neutral-500">
                    enrolled
                  </Text>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Section */}
        <div className="space-y-3 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                {formatPrice(displayPrice)}
              </Text>
              {hasDiscount && (
                <Text className="text-xs line-through text-neutral-500 dark:text-neutral-400">
                  {formatPrice(price)}
                </Text>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="flex-1 rounded"
            >
              <Link href={`/course/${slug}`}>Preview</Link>
            </Button>
            <Button size="lg" asChild className="flex-1 rounded">
              <Link href={`/checkout?courseId=${id}`}>Enroll</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
