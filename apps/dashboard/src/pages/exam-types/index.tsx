import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconPencil, IconPlus, IconDatabase, IconTrash } from "@tabler/icons-react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@flcn-lms/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@flcn-lms/ui/components/dialog"
import { Field, FieldGroup, FieldLabel } from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import { Switch } from "@flcn-lms/ui/components/switch"
import { Textarea } from "@flcn-lms/ui/components/textarea"

import {
  examTypesApi,
  type ExamType,
  type CreateExamTypePayload,
} from "../../lib/api/exam-types"

export default function ExamTypesPage() {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ExamType | null>(null)

  const { data: examTypes = [], isLoading } = useQuery({
    queryKey: ["exam-types"],
    queryFn: () => examTypesApi.list(true), // include inactive
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateExamTypePayload) => examTypesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exam-types"] })
      setCreateOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof examTypesApi.update>[1] }) =>
      examTypesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exam-types"] })
      setEditTarget(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => examTypesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exam-types"] }),
  })

  const seedMutation = useMutation({
    mutationFn: () => examTypesApi.seed(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exam-types"] }),
  })

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    createMutation.mutate({
      slug: fd.get("slug") as string,
      label: fd.get("label") as string,
      description: (fd.get("description") as string) || undefined,
      order: fd.get("order") ? Number(fd.get("order")) : undefined,
    })
  }

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editTarget) return
    const fd = new FormData(e.currentTarget)
    updateMutation.mutate({
      id: editTarget.id,
      data: {
        label: fd.get("label") as string,
        description: (fd.get("description") as string) || undefined,
        order: fd.get("order") ? Number(fd.get("order")) : undefined,
      },
    })
  }

  const ExamTypeForm = ({ defaultValues }: { defaultValues?: Partial<ExamType> }) => (
    <FieldGroup>
      {!defaultValues && (
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input name="slug" placeholder="JEE_MAINS" required />
        </Field>
      )}
      <Field>
        <FieldLabel>Label</FieldLabel>
        <Input name="label" placeholder="JEE Mains" required defaultValue={defaultValues?.label} />
      </Field>
      <Field>
        <FieldLabel>Description</FieldLabel>
        <Textarea name="description" rows={2} defaultValue={defaultValues?.description ?? ""} />
      </Field>
      <Field>
        <FieldLabel>Order</FieldLabel>
        <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="max-w-xs" />
      </Field>
    </FieldGroup>
  )

  return (
    <>
      <Helmet>
        <title>Exam Types — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Exam Types</h2>
            <p className="text-sm text-muted-foreground">{examTypes.length} types</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
            >
              <IconDatabase className="size-4" />
              Seed defaults
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <IconPlus className="size-4" />
                  New Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Exam Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                  <ExamTypeForm />
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {examTypes.map((et) => (
              <Card key={et.id} className={et.isActive ? "" : "opacity-60"}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm">{et.label}</CardTitle>
                      <p className="font-mono text-xs text-muted-foreground">{et.slug}</p>
                    </div>
                    <Switch
                      checked={et.isActive}
                      onCheckedChange={(checked) =>
                        updateMutation.mutate({ id: et.id, data: { isActive: checked } })
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {et.description && (
                    <p className="mb-3 text-xs text-muted-foreground">{et.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">order {et.order}</Badge>
                    <div className="ml-auto flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={() => setEditTarget(et)}
                      >
                        <IconPencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(et.id)}
                      >
                        <IconTrash className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit — {editTarget?.label}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <ExamTypeForm defaultValues={editTarget ?? undefined} />
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
