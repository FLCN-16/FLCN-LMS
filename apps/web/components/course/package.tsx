import { Cancel, Check } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Heading, Text } from "@flcn-lms/ui/components/typography"
import { cn } from "@flcn-lms/ui/lib/utils"

interface CoursePackageFeatureProps {
  title: string
  isIncluded: boolean
}

function CoursePackageFeature({
  title,
  isIncluded,
}: CoursePackageFeatureProps) {
  return (
    <div className="flex items-center-safe gap-x-1">
      <HugeiconsIcon icon={isIncluded ? Check : Cancel} size={16} />
      <Text className="text-sm">{title}</Text>
    </div>
  )
}

interface CoursePackageProps {
  title: string
  price: string | number
  validityMonths: number
  features: CoursePackageFeatureProps[]
}

function CoursePackage({
  title,
  price,
  validityMonths,
  features,
}: CoursePackageProps) {
  return (
    <div className="flex cursor-pointer flex-col overflow-hidden rounded">
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 font-mono",
          "bg-linear-to-r from-violet-700 to-orange-700 text-primary-foreground"
        )}
      >
        <Heading variant="h5" className="uppercase">
          {title}
        </Heading>
        <div className="flex items-center gap-x-2">
          <Text className="text-md">{price} USD</Text>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 rounded-b border border-t-0 px-3 py-4">
        <div className="flex flex-col">
          <Text className="text-xs uppercase">Validity</Text>
          <Text className="text-lg font-semibold">{validityMonths} Months</Text>
        </div>

        <div className="flex flex-col gap-y-1 rounded-b">
          {features.map((feature) => (
            <CoursePackageFeature
              key={feature.title}
              title={feature.title}
              isIncluded={feature.isIncluded}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CoursePackage
