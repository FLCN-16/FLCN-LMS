import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@flcn-lms/ui/components/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@flcn-lms/ui/components/input-group"

export default function CoursesHeader() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/10 to-accent/5 py-20 md:py-28">
      {/* Subtle decorative background element */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find Your Next Course
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore thousands of courses from industry experts. Start learning today.
            </p>
          </div>

          {/* Search bar */}
          <div className="mx-auto w-full max-w-xl">
            <InputGroup className="h-12">
              <InputGroupAddon>
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="h-5 w-5 text-muted-foreground"
                />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search courses, topics, instructors..."
                className="text-base"
              />
              <Button
                size="sm"
                className="mr-1 bg-accent text-white hover:bg-accent/90"
              >
                Search
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </section>
  )
}
