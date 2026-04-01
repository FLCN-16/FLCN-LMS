import type React from "react"

import MarketingFooter from "./_components/footer"
import MarketingHeader from "./_components/header"

import "@flcn-lms/ui/globals.css"

async function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}

export default MarketingLayout
