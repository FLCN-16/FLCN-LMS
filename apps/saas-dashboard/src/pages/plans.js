import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, MoreHorizontal, Package, Layers } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { usePlans } from "@/queries/plans";
function PlansPage() {
    const { data: plans, isLoading } = usePlans();
    return (<div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <Helmet>
        <title>Plans — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header with Action */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-violet-500"/>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Plans
            </h1>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground">
            Manage subscription plans with features, pricing, and configurations.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link to="/plans/new">
            <Plus className="h-4 w-4"/>
            Add Plan
          </Link>
        </Button>
      </div>

      {/* Stats Card */}
      <div className="rounded-lg border border-border bg-gradient-to-r from-violet-50/50 to-amber-50/50 dark:from-violet-950/20 dark:to-amber-950/20 p-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-violet-500"/>
          <p className="text-sm text-muted-foreground">
            Total Plans: <span className="font-semibold text-foreground">{plans?.length || 0}</span>
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border overflow-hidden">
        {isLoading ? (<div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading plans...</p>
          </div>) : plans && plans.length > 0 ? (<Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">Monthly Price</TableHead>
                <TableHead className="font-semibold text-right">Yearly Price</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (<TableRow key={plan.id} className="cursor-pointer transition-colors duration-200 hover:bg-muted/60">
                  <TableCell className="font-semibold text-foreground">
                    <Link to={`/plans/${plan.id}/edit`} className="text-violet-600 dark:text-violet-400 hover:underline transition-colors duration-150">
                      {plan.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {plan.description || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-right text-foreground font-medium">
                    ${Number(plan.priceMonthly).toFixed(2)}/mo
                  </TableCell>
                  <TableCell className="text-sm text-right text-foreground font-medium">
                    ${Number(plan.priceYearly).toFixed(2)}/yr
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.isActive
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"}`}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" asChild className="transition-colors duration-150 hover:bg-violet-500/10">
                      <Link to={`/plans/${plan.id}/edit`}>
                        <MoreHorizontal className="h-4 w-4"/>
                        <span className="sr-only">Edit {plan.name}</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>) : (<div className="flex flex-col items-center justify-center py-12 px-4">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-4"/>
            <p className="text-muted-foreground mb-4">No plans yet</p>
            <Button asChild>
              <Link to="/plans/new">
                <Plus className="h-4 w-4"/>
                Create First Plan
              </Link>
            </Button>
          </div>)}
      </div>
    </div>);
}
export default PlansPage;
