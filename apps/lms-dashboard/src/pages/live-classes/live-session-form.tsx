import { useState } from "react"

import { Badge } from "@flcn-lms/ui/components/badge"
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

interface LiveSessionFormProps {
  defaultValues?: {
    title?: string
    description?: string
    courseId?: string
    scheduledAt?: string
    duration?: number
    status?: string
    recordingUrl?: string
  }
  onSubmit: (data: any) => void
  isLoading: boolean
  submitLabel?: string
}

export function LiveSessionForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save session",
}: LiveSessionFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "")
  const [description, setDescription] = useState(defaultValues?.description ?? "")
  const [courseId, setCourseId] = useState(defaultValues?.courseId ?? "")
  const [scheduledAt, setScheduledAt] = useState(defaultValues?.scheduledAt ?? "")
  const [duration, setDuration] = useState(
    defaultValues?.duration ? String(defaultValues.duration) : "60"
  )
  const [status, setStatus] = useState(defaultValues?.status ?? "scheduled")
  const [recordingUrl, setRecordingUrl] = useState(
    defaultValues?.recordingUrl ?? ""
  )

  const isFormValid = Boolean(title.trim() && scheduledAt)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      courseId: courseId || undefined,
      scheduledAt,
      duration: parseInt(duration) || 60,
      status,
      recordingUrl: recordingUrl.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Session Details</CardTitle>
          <CardDescription>
            Configure your live class session information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Session Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Physics - Newton's Laws of Motion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <FieldDescription>
                The main topic or title of your live session
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what will be covered in this session..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <FieldDescription>
                Optional detailed description of the session
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="scheduledAt">Scheduled Date & Time</FieldLabel>
              <Input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
              <FieldDescription>
                When the live session will start
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="15"
                max="480"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <FieldDescription>
                Expected duration of the live session in minutes
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
                onChange={(e) => setStatus(e.target.value)}
              >
                <NativeSelectOption value="scheduled">Scheduled</NativeSelectOption>
                <NativeSelectOption value="live">Live</NativeSelectOption>
                <NativeSelectOption value="completed">Completed</NativeSelectOption>
                <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
              </NativeSelect>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="recordingUrl">Recording URL</FieldLabel>
              <Input
                id="recordingUrl"
                name="recordingUrl"
                type="url"
                placeholder="https://recordings.example.com/session-123"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
              />
              <FieldDescription>
                Link to the recorded session (if completed)
              </FieldDescription>
            </Field>
          </FieldGroup>
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
