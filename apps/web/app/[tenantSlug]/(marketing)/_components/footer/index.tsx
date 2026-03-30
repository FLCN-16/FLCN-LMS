"use client"

import type React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Facebook01Icon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@flcn-lms/ui/components/button"
import AppLogo from "@/components/logo"

interface FooterLink {
  title: string
  href: string
  icon?: IconSvgElement
}
interface FooterLinkGroup {
  label: string
  links: FooterLink[]
}

const socialLinks: FooterLink[] = [
  { title: "Facebook", href: "#", icon: Facebook01Icon },
  { title: "Instagram", href: "#", icon: InstagramIcon },
  { title: "Youtube", href: "#", icon: YoutubeIcon },
  { title: "LinkedIn", href: "#", icon: LinkedinIcon },
]

const footerLinkGroups: FooterLinkGroup[] = [
  {
    label: "product",
    links: [
      { title: "Payments", href: "#" },
      { title: "Cards & Issuing", href: "#" },
      { title: "Lending & Credit", href: "#" },
      { title: "Wealth Management", href: "#" },
      { title: "Insurance", href: "#" },
      { title: "Crypto Wallets", href: "#" },
      { title: "Treasury Management", href: "#" },
      { title: "Merchant Services", href: "#" },
      { title: "Point of Sale", href: "#" },
      { title: "Embedded Finance", href: "#" },
      { title: "Open Banking API", href: "#" },
      { title: "SDKs & Integrations", href: "#" },
      { title: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "resources",
    links: [
      { title: "Blog", href: "#" },
      { title: "Case Studies", href: "#" },
      { title: "Documentation", href: "#" },
      { title: "API Reference", href: "#" },
      { title: "Developer Tools", href: "#" },
      { title: "Whitepapers", href: "#" },
      { title: "Reports & Research", href: "#" },
      { title: "Events & Webinars", href: "#" },
      { title: "E-books", href: "#" },
      { title: "Community Forum", href: "#" },
      { title: "Release Notes", href: "#" },
      { title: "System Status", href: "#" },
    ],
  },
  {
    label: "company",
    links: [
      { title: "About Us", href: "#" },
      { title: "Leadership", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Press", href: "#" },
      { title: "Sustainability", href: "#" },
      { title: "Diversity & Inclusion", href: "#" },
      { title: "Investor Relations", href: "#" },
      { title: "Partners", href: "#" },
      { title: "Legal & Compliance", href: "#" },
      { title: "Privacy Policy", href: "#" },
      { title: "Cookie Policy", href: "#" },
      { title: "Terms of Service", href: "#" },
      { title: "AML & KYC Policy", href: "#" },
    ],
  },
]

function Footer() {
  const t = useTranslations("footer")

  return (
    <footer
      className="relative h-(--footer-height) w-full border-t [--footer-height:520px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 h-(--footer-height) w-full">
        <div className="sticky top-[calc(100vh-var(--footer-height))] h-full overflow-y-auto">
          <div className="relative mx-auto flex size-full max-w-6xl flex-col justify-between gap-5">
            <div className="grid grid-cols-1 gap-8 px-4 pt-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="w-full space-y-4">
                <AppLogo className="h-5" />
                <p className="mt-8 text-sm text-muted-foreground md:mt-0">
                  {t("tagline")}
                </p>
                <div className="flex gap-2">
                  {socialLinks.map((link, index) => (
                    <Button
                      asChild
                      key={`social-${link.href}-${index}`}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Link href={link.href}>
                        <HugeiconsIcon icon={link.icon!} />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
              {footerLinkGroups.map((group) => (
                <div className="w-full" key={group.label}>
                  <div className="mb-10 md:mb-0">
                    <h3 className="text-sm uppercase">
                      {t(
                        `groups.${group.label as "product" | "resources" | "company"}`
                      )}
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground md:text-xs lg:text-sm">
                      {group.links.map((link) => (
                        <li key={link.title}>
                          <a
                            className="inline-flex items-center hover:text-foreground [&_svg]:me-1 [&_svg]:size-4"
                            href={link.href}
                          >
                            {link.icon}
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-between gap-2 border-t p-4 text-sm text-muted-foreground md:flex-row">
              <p>{t("copyright", { year: new Date().getFullYear() })}</p>
              <div className="space-x-2">
                <Link
                  className="hover:text-foreground"
                  href="/legal/privacy-policy"
                >
                  {t("privacyPolicy")}
                </Link>
                <Link
                  className="hover:text-foreground"
                  href="/legal/terms-of-service"
                >
                  {t("termsOfService")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
