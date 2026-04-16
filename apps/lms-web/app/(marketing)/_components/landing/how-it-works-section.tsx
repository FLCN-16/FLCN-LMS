import {
  Book01Icon,
  GraduationScrollIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

interface StepCardProps {
  step: number
  icon: IconSvgElement
  title: string
  description: string
}

const STEPS: Omit<StepCardProps, "step">[] = [
  {
    icon: Search01Icon,
    title: "Browse Courses",
    description:
      "Explore hundreds of expert-led courses across technology, business, design, and more.",
  },
  {
    icon: Book01Icon,
    title: "Enroll Instantly",
    description:
      "Sign up and get immediate, lifetime access to your chosen course and all its resources.",
  },
  {
    icon: GraduationScrollIcon,
    title: "Learn & Achieve",
    description:
      "Work through structured content, pass assessments, and earn your verified certificate.",
  },
]

function StepCard({ step, icon, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <HugeiconsIcon icon={icon} className="size-7 text-primary" />
        </div>
        <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {step}
        </span>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 space-y-2 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to start your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <StepCard key={step.title} step={index + 1} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
