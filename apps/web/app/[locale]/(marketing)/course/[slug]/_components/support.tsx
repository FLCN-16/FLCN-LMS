import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { QuestionIcon } from "@hugeicons/core-free-icons"

import { Heading } from "@flcn-lms/ui/components/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@flcn-lms/ui/components/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

async function CourseDetailSupport() {
  const t = useTranslations("course.support")

  return (
    <section id="course-detail-support">
      <div className="container flex flex-col gap-y-8">
        <Heading variant="h2">{t("sectionTitle")}</Heading>

        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-8">
            <Accordion type="single" className="rounded-md border" collapsible>
              <AccordionItem value="course-duration" className="px-4">
                <AccordionTrigger>{t("faqDuration")}</AccordionTrigger>
                <AccordionContent>
                  <p>{t("faqDurationAnswer")}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="col-span-4">
            <Card className="rounded-md">
              <CardHeader>
                <div className="flex items-center gap-x-2">
                  <HugeiconsIcon icon={QuestionIcon} />
                  <CardTitle>{t("moreQuestions")}</CardTitle>
                </div>
                <CardDescription>{t("connectVia")}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailSupport
