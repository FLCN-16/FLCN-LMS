"use client"

import Cookies from "js-cookie"
import { useLocale } from "next-intl"

import { Locale } from "@/i18n/config"

const COOKIE_OPTIONS = {
  expires: 365, // days — js-cookie uses days, not seconds
  sameSite: "lax",
  path: "/",
} as const

export function LocaleSwitcher() {
  const locale = useLocale()

  const changeLocale = (next: Locale) => {
    Cookies.set("APP_LOCALE", next, COOKIE_OPTIONS)
  }

  return (
    <select
      value={locale}
      onChange={(e) => changeLocale(e.target.value as Locale)}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  )
}
