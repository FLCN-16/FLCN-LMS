import { getMarketingStats } from "@/fetchers/marketing"

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="font-heading text-3xl font-bold md:text-4xl">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)}K+`
  return n > 0 ? `${n}+` : "0"
}

async function StatsSection() {
  let stats = { published_courses: 0, published_test_series: 0, students: 0, instructors: 0 }

  try {
    stats = await getMarketingStats()
  } catch {
    // Keep zero defaults — section still renders
  }

  const items = [
    { value: formatCount(stats.students), label: "Learners" },
    { value: formatCount(stats.published_courses), label: "Courses" },
    { value: formatCount(stats.instructors), label: "Instructors" },
    { value: formatCount(stats.published_test_series), label: "Test Series" },
  ]

  return (
    <section className="bg-muted/30 py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat) => (
            <StatItem key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
