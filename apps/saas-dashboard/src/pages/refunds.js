import { Helmet } from "react-helmet-async";
import { Plus, MoreHorizontal, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { useRefunds } from "@/queries/refunds";
function RefundsPage() {
    const { data: refunds, isLoading } = useRefunds();
    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="h-4 w-4 text-green-600"/>;
            case "pending":
                return <AlertCircle className="h-4 w-4 text-yellow-600"/>;
            case "rejected":
                return <AlertCircle className="h-4 w-4 text-red-600"/>;
            case "processed":
                return <CheckCircle className="h-4 w-4 text-blue-600"/>;
            case "failed":
                return <AlertCircle className="h-4 w-4 text-red-600"/>;
            default:
                return null;
        }
    };
    return (<div className="space-y-6 px-4 py-2 md:px-6">
      <Helmet>
        <title>Refunds — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Refunds</h1>
          <p className="text-sm text-muted-foreground">
            Process and track refund requests.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4"/>
          Create Refund
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (<TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>) : refunds && refunds.length > 0 ? (refunds.map((refund) => (<TableRow key={refund.id}>
                  <TableCell className="font-mono text-sm">
                    {refund.invoiceId.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {refund.currency} {refund.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(refund.status)}
                      <span className="text-sm capitalize">{refund.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">
                    {refund.reason || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(refund.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {refund.status === "pending" && (<div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-green-600">
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          Reject
                        </Button>
                      </div>)}
                    {refund.status !== "pending" && (<Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4"/>
                      </Button>)}
                  </TableCell>
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No refunds yet
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>);
}
export default RefundsPage;
