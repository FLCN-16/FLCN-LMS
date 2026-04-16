import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, MoreHorizontal, Building2, Users } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { useCustomers } from "@/queries/customers";
function CustomersPage() {
    const { data: customers, isLoading } = useCustomers();
    return (<div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <Helmet>
        <title>Customers — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header with Action */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-cyan-500"/>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Customers
            </h1>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground">
            Manage organizations and institutions using FLCN-LMS platform.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link to="/customers/new">
            <Plus className="h-4 w-4"/>
            Add Customer
          </Link>
        </Button>
      </div>

      {/* Stats Card */}
      <div className="rounded-lg border border-border bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-500"/>
          <p className="text-sm text-muted-foreground">
            Total Customers: <span className="font-semibold text-foreground">{customers?.length || 0}</span>
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border overflow-hidden">
        {isLoading ? (<div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading customers...</p>
          </div>) : customers && customers.length > 0 ? (<Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Slug</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (<TableRow key={customer.id} className="cursor-pointer transition-colors duration-200 hover:bg-muted/60">
                  <TableCell className="font-semibold text-foreground">
                    <Link to={`/customers/${customer.id}/edit`} className="text-cyan-600 dark:text-cyan-400 hover:underline transition-colors duration-150">
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {customer.slug}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.email || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.customDomain || customer.domain || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${customer.isActive
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"}`}>
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" asChild className="transition-colors duration-150 hover:bg-cyan-500/10">
                      <Link to={`/customers/${customer.id}/edit`}>
                        <MoreHorizontal className="h-4 w-4"/>
                        <span className="sr-only">Edit {customer.name}</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>) : (<div className="flex flex-col items-center justify-center py-12 px-4">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mb-4"/>
            <p className="text-muted-foreground mb-4">No customers yet</p>
            <Button asChild>
              <Link to="/customers/new">
                <Plus className="h-4 w-4"/>
                Create First Customer
              </Link>
            </Button>
          </div>)}
      </div>
    </div>);
}
export default CustomersPage;
