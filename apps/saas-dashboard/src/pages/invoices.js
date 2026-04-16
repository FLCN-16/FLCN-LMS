import { Helmet } from "react-helmet-async";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { useInvoices } from "@/queries/invoices";
function InvoicesPage() {
    const { data: invoices, isLoading } = useInvoices();
    const getStatusBadge = (status) => {
        const styles = {
            draft: "bg-gray-100 text-gray-800",
            sent: "bg-blue-100 text-blue-800",
            paid: "bg-green-100 text-green-800",
            overdue: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };
    return (<div className="space-y-6 px-4 py-2 md:px-6">
      <Helmet>
        <title>Invoices — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track customer invoices.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4"/>
          Create Invoice
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (<TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>) : invoices && invoices.length > 0 ? (invoices.map((invoice) => (<TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-sm">{invoice.customerId}</TableCell>
                  <TableCell className="font-medium">
                    {invoice.currency} {invoice.amount}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No invoices yet
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>);
}
export default InvoicesPage;
