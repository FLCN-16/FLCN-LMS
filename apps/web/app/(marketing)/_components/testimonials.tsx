import { getTranslations } from "next-intl/server"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

const TESTIMONIALS = [
  { name: "AE", year: 2018 },
  { name: "JM", year: 2020 },
  { name: "SR", year: 2022 },
] as const

async function TestimonialsSection() {
  const tTestimonial = await getTranslations("testimonial")

  return (
    <section className="container mx-auto px-4 py-16">
      <Heading variant="h2">What teams ship with FLCN LMS</Heading>
      <Text variant="muted" className="mt-2 max-w-2xl">
        Feedback from operators and instructors running exams and cohorts at
        scale.
      </Text>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <Card
            key={t.name}
            className="rounded-2xl border bg-card/60 shadow-sm transition hover:-translate-y-2 hover:border-primary/40 hover:bg-card hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border bg-background text-xs font-semibold tracking-wide uppercase">
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {tTestimonial("learnerSince", { year: t.year })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Text variant="p" className="text-sm leading-relaxed">
                {tTestimonial("quote")}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
