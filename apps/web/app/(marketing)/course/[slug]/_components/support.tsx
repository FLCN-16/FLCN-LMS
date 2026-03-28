import { HugeiconsIcon } from "@hugeicons/react"
import { QuestionIcon } from "@hugeicons/core-free-icons"

import { Heading } from "@workspace/ui/components/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

async function CourseDetailSupport() {
  return (
    <section id="course-detail-support">
      <div className="container flex flex-col gap-y-8">
        <Heading variant="h2">Frequently asked questions</Heading>

        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-8">
            <Accordion type="single" className="rounded-md border" collapsible>
              <AccordionItem value="course-duration" className="px-4">
                <AccordionTrigger>
                  How long does the course take to complete?
                </AccordionTrigger>

                <AccordionContent>
                  <p>The course takes to complete.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="col-span-4">
            <Card className="rounded-md">
              <CardHeader>
                <div className="flex items-center gap-x-2">
                  <HugeiconsIcon icon={QuestionIcon} />
                  <CardTitle>More Questions?</CardTitle>
                </div>
                <CardDescription>
                  Connect with us via below methods
                </CardDescription>
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
