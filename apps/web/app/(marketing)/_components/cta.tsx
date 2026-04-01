import Link from "next/link"

import { Button } from "@flcn-lms/ui/components/button"
import { Card, CardContent } from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

function CtaSection() {
  return (
    <section className="container mx-auto px-4 pb-16">
      <Card className="overflow-hidden rounded-2xl border bg-linear-to-br from-primary/15 via-primary/5 to-secondary/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <Heading variant="h2">Ready to launch your LMS SaaS?</Heading>
            <Text variant="muted" className="mt-2">
              Create an account, configure your first tenant, and invite your
              team.
            </Text>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href="/auth/register">Start free trial</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-dashed hover:border-primary/60"
            >
              <a href="#pricing">Book a demo</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default CtaSection
