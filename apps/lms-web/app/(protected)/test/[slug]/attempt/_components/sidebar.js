import TestTimer from "@/components/test/timer";
import TestTracker from "@/components/test/tracker";
function TestSidebar() {
    return (<aside className="flex w-full max-w-80 shrink-0 flex-col gap-y-6 xl:max-w-100">
      <TestTimer />
      <TestTracker />
    </aside>);
}
export default TestSidebar;
