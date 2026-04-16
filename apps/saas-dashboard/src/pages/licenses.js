import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Plus, MoreHorizontal, Key, Zap } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@flcn-lms/ui/components/select";
import { useLicenses, useLicenseStats } from "@/queries/licenses";
function LicensesPage() {
    const [statusFilter, setStatusFilter] = useState("all");
    const { data: licensesResponse, isLoading } = useLicenses();
    const { data: stats } = useLicenseStats();
    // Handle both array and object responses
    const licensesArray = Array.isArray(licensesResponse)
        ? licensesResponse
        : licensesResponse?.data || [];
    const filteredLicenses = licensesArray.filter((license) => {
        if (statusFilter !== "all" && license.status !== statusFilter)
            return false;
        return true;
    });
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
            case "suspended":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
            case "expired":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            case "invalid":
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
            default:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        }
    };
    return (<div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <Helmet>
        <title>Licenses — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header with Action */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6 text-amber-500"/>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Licenses
            </h1>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground">
            Manage customer licenses, track usage, and control access to features.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <a href="/licenses/new">
            <Plus className="h-4 w-4"/>
            Issue License
          </a>
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Active</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Suspended</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.suspended}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-red-700 dark:text-red-400">Expired</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.expired}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-400">Invalid</p>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400 mt-1">{stats.invalid}</p>
          </div>
        </div>)}

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="invalid">Invalid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border overflow-hidden">
        {isLoading ? (<div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading licenses...</p>
          </div>) : filteredLicenses && filteredLicenses.length > 0 ? (<Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40">
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="font-semibold">License Key</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Expiry Date</TableHead>
                <TableHead className="font-semibold text-center">Features</TableHead>
                <TableHead className="font-semibold text-center">Max Users</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => (<TableRow key={license.id} className="transition-colors duration-200 hover:bg-muted/60">
                  <TableCell className="font-semibold text-foreground">
                    {license.organizationName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono text-xs">
                    {license.licenseKey.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(license.status)}`}>
                      {license.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {license.expiryDate
                    ? new Date(license.expiryDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">
                      <Zap className="h-3 w-3"/>
                      {license.features?.filter((f) => f.enabled).length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-center text-foreground font-medium">
                    {license.maxUsers || "∞"}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="transition-colors duration-150 hover:bg-amber-500/10">
                      <MoreHorizontal className="h-4 w-4"/>
                      <span className="sr-only">Actions for {license.organizationName}</span>
                    </Button>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>) : (<div className="flex flex-col items-center justify-center py-12 px-4">
            <Key className="h-12 w-12 text-muted-foreground/30 mb-4"/>
            <p className="text-muted-foreground mb-4">No licenses found</p>
            <Button asChild>
              <a href="/licenses/new">
                <Plus className="h-4 w-4"/>
                Issue License
              </a>
            </Button>
          </div>)}
      </div>
    </div>);
}
export default LicensesPage;
