import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { Plus, MoreHorizontal, Shield, Users } from "lucide-react"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@flcn-lms/ui/components/table"
import { useSuperAdmins } from "@/queries/super-admins"

function SuperAdminsPage() {
  const { data: admins, isLoading } = useSuperAdmins()

  return (
    <div className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <Helmet>
        <title>Super Admins — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header with Action */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-500" />
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Super Admins
            </h1>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground">
            Manage system administrators with full platform access and operational privileges.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link to="/super-admins/new">
            <Plus className="h-4 w-4" />
            Add Admin
          </Link>
        </Button>
      </div>

      {/* Stats Card */}
      <div className="rounded-lg border border-border bg-gradient-to-r from-amber-50/50 to-violet-50/50 dark:from-amber-950/20 dark:to-violet-950/20 p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-violet-500" />
          <p className="text-sm text-muted-foreground">
            Total Admins: <span className="font-semibold text-foreground">{admins?.length || 0}</span>
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading administrators...</p>
          </div>
        ) : admins && admins.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Last Login</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="cursor-pointer transition-colors duration-200 hover:bg-muted/60"
                >
                  <TableCell className="font-semibold text-foreground">
                    <Link
                      to={`/super-admins/${admin.id}/edit`}
                      className="text-amber-600 dark:text-amber-400 hover:underline transition-colors duration-150"
                    >
                      {admin.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="transition-colors duration-150 hover:bg-violet-500/10"
                    >
                      <Link to={`/super-admins/${admin.id}/edit`}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Edit {admin.name}</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No administrators yet</p>
            <Button asChild>
              <Link to="/super-admins/new">
                <Plus className="h-4 w-4" />
                Create First Admin
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminsPage
