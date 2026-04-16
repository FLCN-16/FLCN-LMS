import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Award,
  CreditCard,
  Key,
  Package,
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { useLicenseStats } from "@/queries/licenses"
import { useInvoiceStats } from "@/queries/invoices"
import { useApiKeyStats } from "@/queries/api-keys"

function HomePage() {
  const { data: licenseStats, isLoading: licensesLoading } = useLicenseStats()
  const { data: invoiceStats, isLoading: invoicesLoading } = useInvoiceStats()
  const { data: apiKeyStats, isLoading: apiKeysLoading } = useApiKeyStats()

  const stats = [
    {
      label: "Active Licenses",
      value: licensesLoading ? "—" : licenseStats?.active ?? 0,
      href: "/licenses",
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Pending Invoices",
      value: invoicesLoading ? "—" : invoiceStats?.pending ?? 0,
      href: "/invoices",
      icon: CreditCard,
      color: "text-violet-500",
      bgColor: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "API Keys",
      value: apiKeysLoading ? "—" : apiKeyStats?.enabled ?? 0,
      href: "/api-keys",
      icon: Key,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      label: "Total Revenue",
      value: invoicesLoading ? "—" : `$${(invoiceStats?.totalAmount ?? 0) / 100}`,
      href: "/invoices",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ]

  const navItems = [
    {
      label: "Licenses",
      href: "/licenses",
      icon: Award,
      description: "Issue and manage licenses",
    },
    {
      label: "Plans",
      href: "/plans",
      icon: Package,
      description: "Create and update plans",
    },
    {
      label: "API Keys",
      href: "/api-keys",
      icon: Key,
      description: "Manage API credentials",
    },
    {
      label: "Invoices",
      href: "/invoices",
      icon: CreditCard,
      description: "View and manage invoices",
    },
  ]

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <Helmet>
        <title>Dashboard — FLCN SaaS Admin</title>
      </Helmet>

      {/* Hero Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Dashboard
          </h1>
        </div>
        <p className="max-w-2xl text-base text-muted-foreground">
          Real-time overview of licenses, billing, and system operations. Manage your FLCN SaaS
          platform at a glance.
        </p>
      </div>

      {/* Key Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
            Key Metrics
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                to={stat.href}
                className="group rounded-lg border border-border p-6 transition-all duration-200 hover:border-amber-400/40 hover:bg-card/80 active:scale-95"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} rounded-lg p-2 transition-colors duration-200`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-violet-500" />
          <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
            Quick Access
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
              "Licenses": { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200/50 dark:border-amber-800/50", hover: "hover:border-amber-400/60 hover:bg-amber-100/30 dark:hover:bg-amber-950/40" },
              "Plans": { bg: "bg-violet-50 dark:bg-violet-950/20", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200/50 dark:border-violet-800/50", hover: "hover:border-violet-400/60 hover:bg-violet-100/30 dark:hover:bg-violet-950/40" },
              "API Keys": { bg: "bg-cyan-50 dark:bg-cyan-950/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200/50 dark:border-cyan-800/50", hover: "hover:border-cyan-400/60 hover:bg-cyan-100/30 dark:hover:bg-cyan-950/40" },
              "Invoices": { bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200/50 dark:border-emerald-800/50", hover: "hover:border-emerald-400/60 hover:bg-emerald-100/30 dark:hover:bg-emerald-950/40" },
            }
            const colors = colorMap[item.label] || colorMap["Licenses"]

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group relative rounded-lg border p-5 transition-all duration-300 cursor-pointer active:scale-95 ${colors.border} ${colors.hover}`}
              >
                {/* Subtle background gradient */}
                <div className={`absolute inset-0 rounded-lg ${colors.bg} -z-10 transition-colors duration-300`} />

                {/* Content */}
                <div className="flex flex-col h-full">
                  {/* Icon and Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex-shrink-0 rounded-lg p-2.5 transition-all duration-300 ${colors.bg} group-hover:scale-110 group-hover:${colors.text.replace('text-', 'bg-')}/20`}>
                      <Icon className={`h-5 w-5 ${colors.text} transition-transform duration-300 group-hover:rotate-6`} />
                    </div>
                    <ArrowRight className={`h-5 w-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1`} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 space-y-2">
                    <h3 className={`font-semibold text-base ${colors.text} transition-colors duration-300`}>
                      {item.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Click to manage</span>
                    <span className={`text-xs font-semibold ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-lg border border-amber-200/30 dark:border-amber-900/30 bg-gradient-to-r from-amber-50/50 to-violet-50/50 dark:from-amber-950/20 dark:to-violet-950/20 p-6 md:p-8">
        <div className="space-y-3">
          <h3 className="font-semibold text-base">About FLCN SaaS Platform</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            FLCN is a powerful multi-tenant Learning Management System designed for institutional
            deployments. This admin dashboard enables you to manage customer licenses, subscriptions,
            billing operations, and API access centrally. Monitor real-time metrics and take action
            across your SaaS operations.
          </p>
        </div>
      </div>

      {/* Footer Helper */}
      <div className="border-t border-border pt-6">
        <p className="text-xs text-muted-foreground text-center">
          Dashboard last updated • All systems operational
        </p>
      </div>
    </div>
  )
}

export default HomePage
