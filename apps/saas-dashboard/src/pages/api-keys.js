import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, MoreHorizontal, Lock, Unlock } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { useApiKeys } from "@/queries/api-keys";
function ApiKeysPage() {
    const { data: keys, isLoading } = useApiKeys();
    return (<div className="space-y-6 px-4 py-2 md:px-6">
      <Helmet>
        <title>API Keys — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Manage API credentials and access tokens.
          </p>
        </div>
        <Button asChild>
          <Link to="/api-keys/new">
            <Plus className="h-4 w-4"/>
            Generate Key
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scopes</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (<TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>) : keys && keys.length > 0 ? (keys.map((key) => (<TableRow key={key.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link to={`/api-keys/${key.id}/edit`} className="hover:underline">
                      {key.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{key.prefix}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {key.enabled ? (<>
                          <Unlock className="h-4 w-4 text-green-600"/>
                          <span className="text-sm">Enabled</span>
                        </>) : (<>
                          <Lock className="h-4 w-4 text-gray-600"/>
                          <span className="text-sm">Disabled</span>
                        </>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{key.scopes.length}</TableCell>
                  <TableCell className="text-sm">
                    {key.lastUsedAt
                ? new Date(key.lastUsedAt).toLocaleDateString()
                : "Never"}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/api-keys/${key.id}/edit`}>
                        <MoreHorizontal className="h-4 w-4"/>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No API keys yet
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>);
}
export default ApiKeysPage;
