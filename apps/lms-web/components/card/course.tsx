import Image from "next/image"
import Link from "next/link"

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
}

function CourseCard({
  id,
  title,
  slug,
  price,
  discountPrice,
  imageUrl,
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "flex max-w-84 flex-col rounded-lg border p-2",
        "transition-transform duration-200 hover:scale-105"
      )}
    >
      <AspectRatio
        ratio={320 / 180}
        className="pointer-events-none mb-2 overflow-hidden rounded-md"
      >
        <Image src={imageUrl} alt="Course" fill />
      </AspectRatio>

      <div className="flex flex-col gap-y-4 p-2">
        <Heading variant="h3" className="text-md line-clamp-3">
          {title}
        </Heading>

        <div className="flex items-center gap-x-2">
          <Text className="text-lg font-semibold">
            {discountPrice && formatPrice(discountPrice)}
          </Text>
          <Text className="text-sm line-through opacity-60">
            {formatPrice(price)}
          </Text>
        </div>

        <div className="flex gap-x-2 *:flex-1 *:rounded-sm">
          <Button size="lg" variant="outline">
            <Link href={`/course/${slug}`}>Explore Now</Link>
          </Button>
          <Button size="lg">
            <Link href={`/checkout?courseId=${id}`}>Buy Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
