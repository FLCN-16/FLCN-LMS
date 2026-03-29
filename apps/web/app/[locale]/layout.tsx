import { Metadata } from "next"
import { Geist_Mono, DM_Sans, Space_Grotesk } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@flcn-lms/ui/components/tooltip"
import { cn } from "@flcn-lms/ui/lib/utils"
import { routing } from "@/i18n/routing"
import { isRtl, type Locale } from "@/i18n/config"

import "@flcn-lms/ui/globals.css"
import "../globals.css"

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
})

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Acme",
  description: "",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Fetch messages for the current locale (passed to client components)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={isRtl(locale as Locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
        spaceGroteskHeading.variable
      )}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
