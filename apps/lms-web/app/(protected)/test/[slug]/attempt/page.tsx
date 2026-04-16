import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@flcn-lms/ui/components/button"

import FullscreenGate from "@/components/test/fullscreen-gate"
import TestQuestionCard from "@/components/test/question-card"

interface TestPageProps {
  params: Promise<{ slug: string }>
}

async function TestAttemptPage({ params }: TestPageProps) {
  const { slug } = await params

  return (
    <FullscreenGate>
      <div className="flex h-full flex-col gap-y-6">
        <TestQuestionCard />

        <footer className="mt-auto flex *:rounded-xs">
          <Button size="lg">
            <span>Mark for Review</span>
          </Button>

          <div className="ml-auto flex gap-x-4 *:rounded-xs">
            <Button variant="ghost" size="lg">
              <HugeiconsIcon icon={ArrowLeft01Icon} />
              <span>Previous</span>
            </Button>
            <Button size="lg">
              <span>Save and Next</span>
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Button>
          </div>
        </footer>
      </div>
    </FullscreenGate>
  )
}

export default TestAttemptPage
