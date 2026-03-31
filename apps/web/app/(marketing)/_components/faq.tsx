import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@flcn-lms/ui/components/accordion"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

const FAQS = [
  {
    q: "Who is FLCN LMS for?",
    a: "We’re built for coaching institutes, test‑prep brands, and learning teams that need a serious, exam‑ready LMS—not just a video hosting tool.",
  },
  {
    q: "How many institutes can I run per account?",
    a: "Each account powers a single institute or brand, with its own dedicated LMS, branding, and data.",
  },
  {
    q: "How do we integrate with our existing systems?",
    a: "Use our API layer and web app to plug into your auth, billing, or internal dashboards. The monorepo is designed for extensibility.",
  },
  {
    q: "Is there migration and onboarding support?",
    a: "For Growth and Enterprise plans we help you plan your data model, migrate content, and align your test series and cohorts.",
  },
] as const

function FaqSection() {
  return (
    <section id="faq" className="container mx-auto px-4 pt-6 pb-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Heading variant="h2">Frequently asked questions</Heading>
          <Text variant="muted" className="mt-2 max-w-2xl">
            Quick answers to common questions about the platform.
          </Text>
        </div>
      </div>

      <div className="mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem value={`faq-${index}`} key={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FaqSection
