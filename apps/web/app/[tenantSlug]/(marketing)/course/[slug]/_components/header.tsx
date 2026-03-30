import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@flcn-lms/ui/components/avatar"
import { Heading, Text } from "@flcn-lms/ui/components/typography"
import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Separator } from "@flcn-lms/ui/components/separator"
import { cn } from "@flcn-lms/ui/lib/utils"

async function CourseDetailHeader() {
  const t = await getTranslations("course.header")

  return (
    <section
      id="course-detail-header"
      className="relative mb-18 bg-gray-100 py-12 pb-26 dark:bg-black"
    >
      <div className="container grid grid-cols-12">
        <div className="col-span-8 flex flex-col gap-y-3">
          <div className="flex gap-x-2">
            <Badge variant="outline">{t("online")}</Badge>
            <Badge variant="outline">{t("english")}</Badge>
          </div>
          <Heading variant="h1" className="font-heading">
            ChatGPT + Excel: AI-Enhanced Data Analysis & Insight Specialization
          </Heading>

          <div className="inline-flex flex-col items-start gap-y-4">
            <div className="flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src="https://github.com/flcn-16.png" />
                <AvatarFallback>FN</AvatarFallback>
              </Avatar>

              <Link href={`/instructor/flcn-16`}>
                <Heading variant="h6" className="font-light">
                  The Falcon
                </Heading>
              </Link>

              <Separator orientation="vertical" />

              <Heading variant="h6" className="font-light">
                <strong className="font-semibold">
                  {t("alreadyEnrolled", { count: "446" })}
                </strong>
              </Heading>
            </div>

            <div className="inline-flex items-center gap-x-3">
              <Text className="font-semibold">{t("startsFrom")}</Text>

              <div className="inline-flex items-center gap-x-3 font-mono">
                <Text className="text-2xl font-semibold text-green-600">
                  8,000 INR
                </Text>
                <Text className="text-lg text-gray-400 line-through">
                  12,000 INR
                </Text>
              </div>
            </div>

            <Button size="course-enroll">{t("enrollNow")}</Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 container grid translate-y-1/2 transform grid-cols-4 overflow-hidden rounded bg-primary-foreground p-8 shadow-lg"
        )}
      >
        <div className="flex flex-col items-center">
          <Heading variant="h5">{t("courseSeriesTitle", { count: 3 })}</Heading>
          <span className="font-xs text-center">{t("courseSeriesDesc")}</span>
        </div>

        <div className="flex flex-col items-center">
          <Heading variant="h5" className="inline-flex items-center gap-x-2">
            <HugeiconsIcon icon={StarIcon} size={16} />
            {t("ratingTitle", { rating: "4.8" })}
          </Heading>
          <span className="font-xs text-center">
            {t("ratingDesc", { count: "7,923" })}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Heading variant="h5">{t("flexibleScheduleTitle")}</Heading>
          <span className="font-xs text-center">
            {t("flexibleScheduleDesc")}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Heading variant="h5">{t("weeksTitle", { count: 4 })}</Heading>
          <span className="font-xs text-center">
            {t("weeksDesc", { hours: 3 })}
          </span>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailHeader
