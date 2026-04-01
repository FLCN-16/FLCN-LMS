import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback } from "@flcn-lms/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

function TestimonialCard() {
  const t = useTranslations("testimonial")

  return (
    <Card className="rounded-md">
      <CardHeader className="flex items-center gap-x-3">
        <Avatar size="xl">
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>Felipe M.</CardTitle>
          <CardDescription>{t("learnerSince", { year: 2018 })}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>{t("quote")}</CardContent>
    </Card>
  )
}

export default TestimonialCard
