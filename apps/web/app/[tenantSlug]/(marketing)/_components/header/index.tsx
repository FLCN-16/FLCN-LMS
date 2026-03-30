import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@flcn-lms/ui/components/button"
import { Skeleton } from "@flcn-lms/ui/components/skeleton"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@flcn-lms/ui/components/navigation-menu"

import Link from "next/link"
import AppLogo from "@/components/logo"

const MobileNav = dynamic(() => import("./mobile-nav"), {
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
})

const ThemeToggle = dynamic(() => import("./theme-toggle"), {
  loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
})

function Header() {
  const t = useTranslations("nav")

  const navLinks = [
    { label: t("allCourses"), href: "/courses" },
    { label: t("about"), href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <AppLogo />
        </Link>

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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="link" className="hidden md:flex" asChild>
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button className="hidden rounded md:flex" asChild>
            <Link href="/auth/register">{t("joinFree")}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
