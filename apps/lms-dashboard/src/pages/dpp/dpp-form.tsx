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
import { Switch } from "@flcn-lms/ui/components/switch"
import { Textarea } from "@flcn-lms/ui/components/textarea"

interface DPPFormProps {
  defaultValues?: {
    title?: string
    description?: string
    courseId?: string
    totalQuestions?: number
    duration?: number
    difficulty?: string
    publishedAt?: string
    published?: boolean
  }
  onSubmit: (data: any) => void
  isLoading: boolean
  submitLabel?: string
}

export function DPPForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save DPP",
}: DPPFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "")
  const [description, setDescription] = useState(defaultValues?.description ?? "")
  const [courseId, setCourseId] = useState(defaultValues?.courseId ?? "")
  const [totalQuestions, setTotalQuestions] = useState(
    defaultValues?.totalQuestions ? String(defaultValues.totalQuestions) : "10"
  )
  const [duration, setDuration] = useState(
    defaultValues?.duration ? String(defaultValues.duration) : "30"
  )
  const [difficulty, setDifficulty] = useState(defaultValues?.difficulty ?? "medium")
  const [publishedAt, setPublishedAt] = useState(defaultValues?.publishedAt ?? "")
  const [published, setPublished] = useState(defaultValues?.published ?? false)

  const isFormValid = Boolean(title.trim() && totalQuestions)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      courseId: courseId || undefined,
      totalQuestions: parseInt(totalQuestions) || 10,
      duration: parseInt(duration) || 30,
      difficulty,
      publishedAt: publishedAt || undefined,
      published,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Practice Paper (DPP)</CardTitle>
          <CardDescription>
            Create and manage daily practice papers for student preparation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">DPP Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="e.g., DPP 1 - Algebra Basics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <FieldDescription>
                A clear title for this daily practice paper
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the topics covered in this DPP..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <FieldDescription>
                Optional description of topics and learning outcomes
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="totalQuestions">Total Questions</FieldLabel>
              <Input
                id="totalQuestions"
                name="totalQuestions"
                type="number"
                min="1"
                max="100"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                required
              />
              <FieldDescription>
                Number of questions in this DPP
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
                min="5"
                max="300"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <FieldDescription>
                Recommended time to complete this DPP
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="difficulty">Difficulty Level</FieldLabel>
              <NativeSelect
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <NativeSelectOption value="easy">Easy</NativeSelectOption>
                <NativeSelectOption value="medium">Medium</NativeSelectOption>
                <NativeSelectOption value="hard">Hard</NativeSelectOption>
              </NativeSelect>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="publishedAt">Publish Date</FieldLabel>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
              <FieldDescription>
                When this DPP should be made available to students
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field className="flex items-center justify-between">
              <div>
                <FieldLabel htmlFor="published">Published</FieldLabel>
                <FieldDescription>
                  Make this DPP available to students
                </FieldDescription>
              </div>
              <Switch
                id="published"
                name="published"
                checked={published}
                onCheckedChange={setPublished}
              />
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
