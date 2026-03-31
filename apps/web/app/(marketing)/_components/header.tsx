import Link from "next/link"

import AppLogo from "@/components/logo"
import { Button } from "@flcn-lms/ui/components/button"

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo className="h-7 w-auto" />
          <span className="text-base font-semibold tracking-tight">
            FLCN LMS
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm font-medium hover:underline" href="#features">
            Product
          </a>
          <a className="text-sm font-medium hover:underline" href="#courses">
            Use cases
          </a>
          <a className="text-sm font-medium hover:underline" href="#pricing">
            Pricing
          </a>
          <a className="text-sm font-medium hover:underline" href="#faq">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="link" className="hidden md:inline-flex" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild className="hidden md:inline-flex">
            <Link href="/auth/register">Start free trial</Link>
          </Button>

          <div className="md:hidden">
            <Button asChild size="sm">
              <Link href="/auth/register">Try it</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MarketingHeader
