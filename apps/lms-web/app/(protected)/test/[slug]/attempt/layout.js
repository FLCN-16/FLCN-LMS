import TestHeader from "./_components/header";
import TestSidebar from "./_components/sidebar";
function TestLayout({ children }) {
    return (<div className="flex min-h-screen flex-col bg-white">
      <TestHeader />
      <div className="flex gap-x-6 p-4">
        <main className="flex-1">{children}</main>
        <TestSidebar />
      </div>
    </div>);
}
export default TestLayout;
