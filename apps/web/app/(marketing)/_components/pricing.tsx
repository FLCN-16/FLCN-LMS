import Link from "next/link"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

const PRICING_PLANS = [
  {
    name: "Studio",
    price: "Free",
    description: "For solo creators validating their first programs.",
    features: [
      "1 institute or brand",
      "Up to 100 active learners",
      "Core courses & test engine",
      "Basic reporting",
    ],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$99/mo",
    description:
      "For schools and coaching institutes running multiple batches.",
    features: [
      "1 growing institute",
      "Unlimited active learners",
      "Advanced test flows & proctoring",
      "Instructor & batch reports",
    ],
    cta: "Start trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Let’s talk",
    description: "For large institutes and multi‑campus deployments.",
    features: [
      "Multiple campuses under one brand",
      "Custom domains & SSO",
      "Dedicated infra & SLAs",
      "Solutioning and migration support",
    ],
    cta: "Book a demo",
    highlight: false,
  },
] as const

function PricingSection() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-16">
      <Heading variant="h2">SaaS‑style pricing</Heading>
      <Text variant="muted" className="mt-2 max-w-2xl">
        Start free, validate your use case, then scale your institute when
        you’re ready.
      </Text>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={[
              "relative overflow-hidden rounded-2xl border bg-card/60 transition hover:-translate-y-2 hover:bg-card",
              plan.highlight ? "border-primary/60 shadow-sm" : "border-border",
            ].join(" ")}
          >
            {plan.highlight ? (
              <div className="absolute top-3 right-3">
                <Badge>Most popular</Badge>
              </div>
            ) : null}

            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{plan.price}</div>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground md:text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button
                  asChild
                  className="w-full justify-center transition hover:-translate-y-0.5"
                >
                  <Link href="/auth/register">{plan.cta}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default PricingSection
