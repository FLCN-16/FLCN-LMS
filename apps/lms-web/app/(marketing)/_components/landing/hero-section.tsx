import Link from "next/link"

import { UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-6 text-center" data-scroll>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
            <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
            Trusted by 10,000+ learners
          </Badge>

          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Learn, Grow, Achieve.
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Master in-demand skills with expert-led courses, hands-on tests,
            and a community of 10,000+ learners ready to grow with you.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Start Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
