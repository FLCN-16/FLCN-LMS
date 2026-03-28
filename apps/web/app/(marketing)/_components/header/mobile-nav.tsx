"use client"

import { useState } from "react"
import Link from "next/link"

import { HugeiconsIcon } from "@hugeicons/react"
import { Menu07Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@workspace/ui/components/sheet"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

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
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
