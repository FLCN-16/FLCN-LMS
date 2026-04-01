import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenantSlug: string }>
}) {
  const t = await getTranslations("about")
  return {
    title: t("title"),
    description: t("description"),
  }
}

async function AboutPage() {
  const t = await getTranslations("about")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b px-4 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-b px-4 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t("mission.title")}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t("mission.description")}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                {t("vision.title")}
              </h3>
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                {t("vision.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-b px-4 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            {t("values.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border p-6 space-y-3">
              <h3 className="font-semibold text-lg">{t("values.item1.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.item1.description")}
              </p>
            </div>
            <div className="rounded-lg border p-6 space-y-3">
              <h3 className="font-semibold text-lg">{t("values.item2.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.item2.description")}
              </p>
            </div>
            <div className="rounded-lg border p-6 space-y-3">
              <h3 className="font-semibold text-lg">{t("values.item3.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.item3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            {t("team.title")}
          </h2>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("team.description")}
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
