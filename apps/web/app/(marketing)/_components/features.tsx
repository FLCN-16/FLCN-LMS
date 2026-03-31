import { Card, CardDescription, CardTitle } from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

const FEATURES = [
  {
    title: "Built for serious coaching brands",
    description:
      "Give your learners a focused experience with courses, test series, and progress tracking that feels made for them.",
  },
  {
    title: "Structured curriculum engine",
    description:
      "Model courses, modules, lessons, and test series once, then keep iterating without breaking your structure.",
  },
  {
    title: "Proctoring‑ready test flows",
    description:
      "Timed attempts, fullscreen enforcement, and violation tracking built in for serious exams.",
  },
  {
    title: "Reporting for operators",
    description:
      "Give admins real‑time insight into enrollments, progress, and performance across batches and courses.",
  },
] as const

function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-16">
      <Heading variant="h2">Everything you need to run an LMS</Heading>
      <Text variant="muted" className="mt-3 max-w-2xl">
        A focused, modern LMS experience—built around clarity, consistency, and
        progress.
      </Text>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, idx) => (
          <Card
            key={feature.title}
            className="group h-full rounded-2xl border bg-card/60 p-6 shadow-sm transition hover:-translate-y-2 hover:border-primary/40 hover:bg-card hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full border bg-background px-3 py-1 text-xs font-semibold tracking-tight text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">
                  {feature.title}
                </CardTitle>
                <CardDescription className="mt-2 text-xs leading-relaxed md:text-sm">
                  {feature.description}
                </CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection
