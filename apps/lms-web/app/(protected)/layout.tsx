import { AuthProvider } from "@/context/auth-context"

function StudentPanelLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export default StudentPanelLayout
