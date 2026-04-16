import { Helmet } from "react-helmet-async"
import { Plus, MoreHorizontal } from "lucide-react"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@flcn-lms/ui/components/table"
import { useBillingRecords } from "@/queries/billing"

function BillingPage() {
  const { data: records, isLoading } = useBillingRecords()

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return styles[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6 px-4 py-2 md:px-6">
      <Helmet>
        <title>Billing — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Billing Records</h1>
          <p className="text-sm text-muted-foreground">
            Customer subscriptions and billing history.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Record
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Billing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : records && records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.customerId}</TableCell>
                  <TableCell>
                    {record.currency} {record.amount}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {record.billingCycle}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(record.currentPeriodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No billing records yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BillingPage
