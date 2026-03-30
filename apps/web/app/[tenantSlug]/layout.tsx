import { Metadata } from "next"
import { Geist_Mono, DM_Sans, Space_Grotesk } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

import { TooltipProvider } from "@flcn-lms/ui/components/tooltip"

import { cn } from "@flcn-lms/ui/lib/utils"

import { ThemeProvider } from "@/components/theme-provider"

import { isRtl, type Locale } from "@/i18n/config"

import "swiper/css"
import "@flcn-lms/ui/globals.css"
import { getTenantConfig } from "@/fetchers/tenant"

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
  title: "FLCN LMS",
  description: "",
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenantSlug: string }>
}

async function TenantRootLayout({ children, params }: RootLayoutProps) {
  const { tenantSlug } = await params

  const tenantConfig = await getTenantConfig(tenantSlug)

  const locale = await getLocale()
  // Fetch messages for the current locale (passed to client components)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={isRtl(locale as Locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "antialiased",
          fontMono.variable,
          "font-sans",
          dmSans.variable,
          spaceGroteskHeading.variable
        )}
        style={
          {
            // Color Config
            "--color-primary": tenantConfig.branding?.primaryColor,
            "--color-primary-text": tenantConfig.branding?.primaryTextColor,
            "--color-secondary": tenantConfig.branding?.secondaryColor,
            "--color-secondary-text": tenantConfig.branding?.secondaryTextColor,
            // Font Config
            "--font-sans": `${dmSans.style.fontFamily}`,
            "--font-heading": `${spaceGroteskHeading.style.fontFamily}`,
            "--font-mono": `${fontMono.style.fontFamily}`,
          } as React.CSSProperties
        }
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default TenantRootLayout
