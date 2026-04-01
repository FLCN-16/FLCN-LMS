import Image from "next/image"

import { AspectRatio } from "@flcn-lms/ui/components/aspect-ratio"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import { Heading, Text } from "@flcn-lms/ui/components/typography"

const USE_CASES = [
  {
    title: "K‑12 coaching institute",
    subtitle:
      "Run batches, test series, and doubt sessions for your institute.",
    imageUrl: "https://placehold.co/640x360",
  },
  {
    title: "Edtech product",
    subtitle:
      "Offer a branded LMS experience to your learners without rebuilding core infrastructure.",
    imageUrl: "https://placehold.co/640x360",
  },
  {
    title: "Internal training",
    subtitle:
      "Roll out onboarding and compliance programs to distributed teams.",
    imageUrl: "https://placehold.co/640x360",
  },
] as const

function UseCasesSection() {
  return (
    <section id="courses" className="container mx-auto px-4 pt-4 pb-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Heading variant="h2">Use cases</Heading>
          <Text variant="muted" className="mt-2 max-w-2xl">
            See how different institutes and teams use the same core platform
            across their own brands.
          </Text>
        </div>
        <Button asChild variant="outline">
          <a href="#pricing">See pricing</a>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {USE_CASES.map((useCase) => (
          <Card
            key={useCase.title}
            className="group overflow-hidden rounded-2xl border bg-card/60 shadow-sm transition hover:-translate-y-2 hover:border-primary/40 hover:bg-card hover:shadow-xl"
          >
            <AspectRatio ratio={16 / 9}>
              <Image
                src={useCase.imageUrl}
                alt={useCase.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.05]"
              />
            </AspectRatio>
            <CardHeader>
              <CardTitle>{useCase.title}</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {useCase.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center pt-0">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-between text-xs hover:bg-primary/10 md:text-sm"
              >
                <a href="#pricing">Talk to us</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default UseCasesSection
