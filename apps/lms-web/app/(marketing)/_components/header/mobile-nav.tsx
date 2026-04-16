"use client"

import { Menu07Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import Link from "next/link"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@flcn-lms/ui/components/sheet"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Test Series", href: "/test-series" },
    { label: "Blog", href: "/blogs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
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
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
