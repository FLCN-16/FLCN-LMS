import { getTranslations } from "next-intl/server"

import AppLogo from "@/components/logo"

async function MarketingFooter() {
  const tFooter = await getTranslations("footer")

  return (
    <footer className="border-t py-10">
      <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <AppLogo className="h-6 w-auto" />
          <p className="text-sm text-muted-foreground">{tFooter("tagline")}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {tFooter("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}

export default MarketingFooter
