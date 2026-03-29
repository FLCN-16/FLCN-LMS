import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import Image from "next/image"

import { Button } from "@flcn-lms/ui/components/button"
import { Link } from "@/i18n/navigation"
import LoginForm from "@/components/form/login-form"

function AuthLogin() {
  const t = useTranslations("auth")

  return (
    <div className="grid min-h-svh lg:grid-cols-6">
      <div className="relative hidden bg-muted lg:col-span-4 lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-2">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            {t("brandName")}
          </Link>

          <Button variant="ghost" size="icon-lg" className="ml-auto" asChild>
            <Link href="/">
              <HugeiconsIcon icon={Cancel01Icon} size={32} />
            </Link>
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLogin
