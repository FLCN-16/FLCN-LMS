import { useState } from "react"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@flcn-lms/ui/components/native-select"
import { Textarea } from "@flcn-lms/ui/components/textarea"

interface BatchFormProps {
  defaultValues?: {
    name?: string
    description?: string
    courseId?: string
    instructorId?: string
    capacity?: number
    startDate?: string
    endDate?: string
    status?: "active" | "inactive" | "completed"
  }
  onSubmit: (data: any) => void
  isLoading: boolean
  submitLabel?: string
}

export function BatchForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Batch",
}: BatchFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? "")
  const [description, setDescription] = useState(defaultValues?.description ?? "")
  const [courseId, setCourseId] = useState(defaultValues?.courseId ?? "")
  const [instructorId, setInstructorId] = useState(defaultValues?.instructorId ?? "")
  const [capacity, setCapacity] = useState(
    defaultValues?.capacity ? String(defaultValues.capacity) : "50"
  )
  const [startDate, setStartDate] = useState(defaultValues?.startDate ?? "")
  const [endDate, setEndDate] = useState(defaultValues?.endDate ?? "")
  const [status, setStatus] = useState<"active" | "inactive" | "completed">(
    defaultValues?.status ?? "active"
  )

  const isFormValid = Boolean(name.trim())

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      courseId: courseId || undefined,
      instructorId: instructorId || undefined,
      capacity: capacity ? parseInt(capacity) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
          <CardDescription>
            Create and manage student batches for course delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Batch Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Physics 101 - Batch A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FieldDescription>
                Name of the batch
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the batch..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <FieldDescription>
                Optional description of the batch
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="courseId">Course ID</FieldLabel>
                <Input
                  id="courseId"
                  name="courseId"
                  placeholder="Leave empty if not linked to a course"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                />
                <FieldDescription>
                  Optional course ID to link this batch
                </FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="instructorId">Instructor ID</FieldLabel>
                <Input
                  id="instructorId"
                  name="instructorId"
                  placeholder="Leave empty if not assigned"
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                />
                <FieldDescription>
                  Optional instructor ID
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="capacity">Batch Capacity</FieldLabel>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <FieldDescription>
                  Maximum number of students in this batch
                </FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <NativeSelect
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "completed")}
                >
                  <NativeSelectOption value="active">Active</NativeSelectOption>
                  <NativeSelectOption value="inactive">Inactive</NativeSelectOption>
                  <NativeSelectOption value="completed">Completed</NativeSelectOption>
                </NativeSelect>
              </Field>
            </FieldGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <FieldDescription>
                  When the batch starts
                </FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <FieldDescription>
                  When the batch ends
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid || isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
