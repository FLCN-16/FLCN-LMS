import Image from "next/image"
import Link from "next/link"

import { AspectRatio } from "@flcn-lms/ui/components/aspect-ratio"
import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Card, CardContent } from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/10 via-background to-background" />
      <div className="pointer-events-none absolute -top-32 -left-40 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-32 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container mx-auto flex flex-col items-center gap-10 px-4 py-14 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs tracking-wide uppercase shadow-sm backdrop-blur">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-[0.7rem] text-muted-foreground">
              Built for coaching & institutes
            </span>
          </div>

          <Heading variant="h1" className="mt-2">
            Launch your own branded LMS without rebuilding everything
          </Heading>

          <Text variant="lead" className="max-w-prose">
            FLCN LMS gives you the building blocks for courses, test series, and
            monitoring, so your team can focus on content and growth—not
            plumbing.
          </Text>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href="/auth/register">Start free trial</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-dashed transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background/80"
            >
              <a href="#pricing">Book a demo</a>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border bg-card/60 p-3 shadow-xs transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card">
              <div className="text-2xl font-bold">10+</div>
              <Text variant="muted">Tenants per cluster</Text>
            </div>
            <div className="rounded-xl border bg-card/60 p-3 shadow-xs transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card">
              <div className="text-2xl font-bold">100K+</div>
              <Text variant="muted">Monthly attempts</Text>
            </div>
            <div className="rounded-xl border bg-card/60 p-3 shadow-xs transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card">
              <div className="text-2xl font-bold">&lt;5m</div>
              <Text variant="muted">To spin up a tenant</Text>
            </div>
          </div>
        </div>

        <Card className="relative z-10 w-full max-w-lg overflow-hidden border bg-card/70 shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-2 hover:border-primary/50">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="https://placehold.co/960x540"
              alt="Dashboard preview"
              fill
              className="object-cover transition duration-500 hover:scale-[1.03]"
            />
          </AspectRatio>
          <CardContent className="grid grid-cols-3 gap-3 bg-linear-to-b from-background/40 to-background/80 p-4">
            {[
              { label: "Active learners", value: "4.3k" },
              { label: "Completion rate", value: "87%" },
              { label: "On‑time tests", value: "99%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-background/70 p-3 text-xs transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="text-lg font-semibold">{item.value}</div>
                <Text variant="muted" className="text-[0.7rem]">
                  {item.label}
                </Text>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default HeroSection
