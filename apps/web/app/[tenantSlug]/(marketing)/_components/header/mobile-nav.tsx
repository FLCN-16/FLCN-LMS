"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu07Icon } from "@hugeicons/core-free-icons"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@flcn-lms/ui/components/sheet"
import Link from "next/link"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations("mobileNav")

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("products"), href: "/products" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("blog"), href: "/blog" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <HugeiconsIcon
            icon={Menu07Icon}
            color="currentColor"
            className="h-5 w-5"
          />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 pt-10">
        <nav className="mt-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link
                href={link.href}
                className="text-lg font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <div className="mt-4 border-t pt-4">
            <Button className="w-full" asChild>
              <Link href="/signup">{t("getStarted")}</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
