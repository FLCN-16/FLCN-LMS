import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  User as UserIcon, 
  UserMinus, 
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@flcn-lms/ui/components/table"
import { Button } from "@flcn-lms/ui/components/button"
import { Input } from "@flcn-lms/ui/components/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@flcn-lms/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@flcn-lms/ui/components/dropdown-menu"
import { Badge } from "@flcn-lms/ui/components/badge"
import { toast } from "sonner"

import { 
  useUsers, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser 
} from "@/queries/users"
import { type User } from "@/queries/users"
import { StudentForm } from "./student-form"

export default function InstituteStudentsPage() {
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data: any) => {
    try {
      await createUser.mutateAsync(data)
      setIsAddOpen(false)
      toast.success("User created successfully")
    } catch (error) {
      toast.error("Failed to create user")
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingUser) return
    try {
      await updateUser.mutateAsync({ id: editingUser.id, data })
      setEditingUser(null)
      toast.success("User updated successfully")
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser.mutateAsync({ id })
        toast.success("User deleted successfully")
      } catch (error) {
        toast.error("Failed to delete user")
      }
    }
  }

  const toggleStatus = async (user: User) => {
    try {
      await updateUser.mutateAsync({ 
        id: user.id, 
        data: { isActive: !user.isActive } 
      })
      toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully`)
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <Helmet>
        <title>Students — FLCN Management</title>
      </Helmet>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-sm text-muted-foreground">
            Manage your institute&apos;s students and members.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading students...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.isActive ? "default" : "secondary"}
                      className="gap-1.5"
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-400" : "bg-gray-400"}`} />
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <UserIcon className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(user)}>
                          {user.isActive ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4 text-orange-500" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Delete Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student&apos;s details to create their account.
            </DialogDescription>
          </DialogHeader>
          <StudentForm 
            onSubmit={handleCreate} 
            isLoading={createUser.isPending} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student Details</DialogTitle>
            <DialogDescription>
              Update information for {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <StudentForm 
              initialData={editingUser} 
              onSubmit={handleUpdate} 
              isLoading={updateUser.isPending} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
