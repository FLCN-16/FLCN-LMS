import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Key, Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@flcn-lms/ui/components/button"
import { useLicense, useSuspendLicense, useReactivateLicense } from "@/queries/licenses"

function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const { data: license, isLoading } = useLicense({ variables: { id: id! }, enabled: !!id })
  const suspendMutation = useSuspendLicense()
  const reactivateMutation = useReactivateLicense()

  const handleCopyKey = () => {
    if (license?.licenseKey) {
      navigator.clipboard.writeText(license.licenseKey)
      setCopied(true)
      toast.success("License key copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSuspend = async () => {
    if (!id) return
    try {
      await suspendMutation.mutateAsync(id)
      toast.success("License suspended successfully")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to suspend license"
      toast.error(message)
    }
  }

  const handleReactivate = async () => {
    if (!id) return
    try {
      await reactivateMutation.mutateAsync(id)
      toast.success("License reactivated successfully")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reactivate license"
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading license...</p>
      </div>
    )
  }

  if (!license) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">License not found</p>
        <Button asChild>
          <Link to="/licenses">Back to Licenses</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "suspended":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>{license.organizationName} License — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
          <Link
            to="/licenses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Licenses
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2.5">
              <Key className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {license.organizationName}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(license.status)}`}>
                  {license.status}
                </span>
                <p className="text-sm text-muted-foreground">
                  ID: {license.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* License Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Main Info Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">License Information</h2>
            <div className="space-y-4">
              {/* License Key */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">License Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono text-foreground">
                    {license.licenseKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyKey}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Max Users */}
              <div>
                <p className="text-sm text-muted-foreground">Max Users</p>
                <p className="text-lg font-semibold text-foreground">
                  {license.maxUsers || "Unlimited"}
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {license.expiryDate
                    ? new Date(license.expiryDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Perpetual"}
                </p>
              </div>

              {/* Created Date */}
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(license.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Features</h2>
            {license.features && license.features.length > 0 ? (
              <div className="space-y-3">
                {license.features.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{feature.name}</p>
                      {feature.limit && (
                        <p className="text-xs text-muted-foreground">
                          Limit: {feature.limit}
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      feature.enabled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                    }`}>
                      {feature.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No features configured</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Button asChild variant="outline">
            <Link to={`/licenses/${id}/edit`}>Edit License</Link>
          </Button>
          {license.status === "active" ? (
            <Button
              variant="outline"
              onClick={handleSuspend}
              disabled={suspendMutation.isPending}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/20"
            >
              {suspendMutation.isPending ? "Suspending..." : "Suspend License"}
            </Button>
          ) : license.status === "suspended" ? (
            <Button
              variant="outline"
              onClick={handleReactivate}
              disabled={reactivateMutation.isPending}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
            >
              {reactivateMutation.isPending ? "Reactivating..." : "Reactivate License"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default LicenseDetailPage
