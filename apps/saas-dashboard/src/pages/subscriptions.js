import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { RefreshCw, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@flcn-lms/ui/components/select";
import { useSubscriptions, useSubscriptionStats, useCancelSubscription, useRetryPayment } from "@/queries/subscriptions";
import { toast } from "sonner";
function SubscriptionsPage() {
    const [statusFilter, setStatusFilter] = useState("all");
    const { data: subscriptions, isLoading } = useSubscriptions();
    const { data: stats } = useSubscriptionStats();
    const cancelMutation = useCancelSubscription();
    const retryMutation = useRetryPayment();
    const filteredSubscriptions = (subscriptions || []).filter((sub) => {
        if (statusFilter !== "all" && sub.status !== statusFilter)
            return false;
        return true;
    });
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
            case "paused":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            case "expired":
                return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
            default:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        }
    };
    const handleCancel = async (id) => {
        try {
            await cancelMutation.mutateAsync(id);
            toast.success("Subscription cancelled successfully");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to cancel subscription";
            toast.error(message);
        }
    };
    const handleRetry = async (id) => {
        try {
            await retryMutation.mutateAsync(id);
            toast.success("Payment retry initiated");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to retry payment";
            toast.error(message);
        }
    };
    return (<div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <Helmet>
        <title>Subscriptions — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-500"/>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Subscriptions
          </h1>
        </div>
        <p className="max-w-2xl text-base text-muted-foreground">
          Manage customer subscriptions, billing cycles, and recurring payments.
        </p>
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
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Paused</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.paused}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-red-700 dark:text-red-400">Cancelled</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.cancelled}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-400">Expired</p>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400 mt-1">{stats.expired}</p>
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
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border overflow-hidden">
        {isLoading ? (<div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading subscriptions...</p>
          </div>) : filteredSubscriptions.length > 0 ? (<Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40">
                <TableHead className="font-semibold">License ID</TableHead>
                <TableHead className="font-semibold">Customer ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Cycle</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold">Next Billing</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => (<TableRow key={sub.id} className="transition-colors duration-200 hover:bg-muted/60">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {sub.licenseId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {sub.customerId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground capitalize">
                    {sub.billingCycle}
                  </TableCell>
                  <TableCell className="text-sm text-right text-foreground font-medium">
                    {sub.currency} {sub.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.nextBillingDate
                    ? new Date(sub.nextBillingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {sub.status === "active" && (<Button variant="ghost" size="sm" onClick={() => handleCancel(sub.id)} disabled={cancelMutation.isPending} className="text-destructive hover:text-destructive">
                        Cancel
                      </Button>)}
                    {sub.status !== "active" && sub.status !== "cancelled" && (<Button variant="ghost" size="sm" onClick={() => handleRetry(sub.id)} disabled={retryMutation.isPending}>
                        <RefreshCw className="h-4 w-4"/>
                        Retry
                      </Button>)}
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>) : (<div className="flex flex-col items-center justify-center py-12 px-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4"/>
            <p className="text-muted-foreground">No subscriptions found</p>
          </div>)}
      </div>
    </div>);
}
export default SubscriptionsPage;
