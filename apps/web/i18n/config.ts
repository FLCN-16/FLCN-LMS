export const locales = ["en", "fa"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "fa"

// RTL locales
export const rtlLocales: Locale[] = ["fa"]

export function isRtl(locale: Locale) {
  return rtlLocales.includes(locale)
}
