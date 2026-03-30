import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const LOCALES = ["en", "hi"] as const
const DEFAULT_LOCALE = "en"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const raw = cookieStore.get("APP_LOCALE")?.value
  const locale = LOCALES.includes(raw as any) ? raw! : DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
