import { QuestionIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
import { Heading } from "@flcn-lms/ui/components/typography"

async function CourseDetailSupport() {
  return (
    <section id="course-detail-support" className="py-12">
      <div className="container space-y-8">
        <Heading variant="h2">Frequently Asked Questions</Heading>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Accordion type="single" className="rounded-md border" collapsible>
              <AccordionItem value="course-duration" className="px-4">
                <AccordionTrigger>
                  How long do I have access to the course?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    You'll have lifetime access to the course materials once
                    enrolled. Learn at your own pace and revisit the content
                    anytime.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="certificate" className="px-4">
                <AccordionTrigger>
                  Will I receive a certificate upon completion?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes, you'll receive a certificate of completion after
                    finishing all course modules and assessments.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund" className="px-4">
                <AccordionTrigger>What's your refund policy?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We offer a 30-day money-back guarantee if you're not
                    satisfied with the course. No questions asked.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="requirements" className="px-4">
                <AccordionTrigger>
                  Do I need any prerequisites to take this course?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    No prerequisites required. We've designed this course for
                    beginners, though some basic knowledge can be helpful.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={QuestionIcon} />
                  <CardTitle>Still have questions?</CardTitle>
                </div>
                <CardDescription>
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="mailto:support@flcnlms.com"
                  className="block text-sm text-primary hover:underline"
                >
                  Email us at support@flcnlms.com
                </a>
                <p className="text-xs text-muted-foreground">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailSupport
