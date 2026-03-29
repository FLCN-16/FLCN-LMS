import { defineRouting } from "next-intl/routing"
import { locales, defaultLocale } from "./config"

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Don't prefix the default locale in URLs (e.g. /courses instead of /fa/courses)
  localePrefix: "as-needed",
})
