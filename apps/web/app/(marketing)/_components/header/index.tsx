import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"

// Code-split chunks — loaded separately, not in the main bundle
const MobileNav = dynamic(() => import("./mobile-nav"), {
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
})

const ThemeToggle = dynamic(() => import("./theme-toggle"), {
  loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
})

const navLinks = [
  { label: "All Courses", href: "/courses" },
  { label: "About", href: "/about" },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo — always in the main bundle, above the fold */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span>Acme</span>
        </Link>

        {/* Desktop nav — static import (critical, always visible) */}
        <nav className="hidden items-center md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-x-4">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right side — lazy-loaded client chunks */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="link" className="hidden md:flex" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button className="hidden rounded md:flex" asChild>
            <Link href="/auth/register">Join for Free</Link>
          </Button>
          <MobileNav /> {/* Entire Sheet bundle deferred */}
        </div>
      </div>
    </header>
  )
}

export default Header
