import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon, NoteEditIcon } from "@hugeicons/core-free-icons"

import { Heading, Text } from "@flcn-lms/ui/components/typography"
import TestTimerAction from "./test-timer-action"

function TestHeader() {
  const t = useTranslations("test.header")

  return (
    <header id="test-header" className="flex items-center border-b px-6 py-4">
      <HugeiconsIcon icon={ArrowLeft02Icon} />
      <div className="ml-4 flex items-center-safe">
        <HugeiconsIcon icon={NoteEditIcon} className="mr-4" />
        <div className="flex flex-col">
          <Heading variant="h6">{t("testName")}</Heading>
          <Text className="text-xs">{t("testSubtitle")}</Text>
        </div>
      </div>

      <TestTimerAction />
    </header>
  )
}

export default TestHeader
