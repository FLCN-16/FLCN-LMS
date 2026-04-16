import { ArrowLeft02Icon, NoteEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Heading, Text } from "@flcn-lms/ui/components/typography";
import TestTimerAction from "./test-timer-action";
function TestHeader() {
    return (<header id="test-header" className="flex items-center border-b px-6 py-4">
      <HugeiconsIcon icon={ArrowLeft02Icon}/>
      <div className="ml-4 flex items-center-safe">
        <HugeiconsIcon icon={NoteEditIcon} className="mr-4"/>
        <div className="flex flex-col">
          <Heading variant="h6">Test Name</Heading>
          <Text className="text-xs">Test Subtitle</Text>
        </div>
      </div>

      <TestTimerAction />
    </header>);
}
export default TestHeader;
