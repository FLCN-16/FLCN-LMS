import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

import { TooltipProvider } from "@flcn-lms/ui/components/tooltip"

import { ThemeProvider } from "@/components/theme-provider"

import { isRtl, type Locale } from "@/i18n/config"

async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  // Fetch messages for the current locale (passed to client components)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={isRtl(locale as Locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
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

export default RootLayout
