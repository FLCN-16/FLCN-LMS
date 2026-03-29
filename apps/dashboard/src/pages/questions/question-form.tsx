import { useState } from "react"
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@flcn-lms/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import { NativeSelect, NativeSelectOption } from "@flcn-lms/ui/components/native-select"
import { Separator } from "@flcn-lms/ui/components/separator"

import { RichEditor } from "../../components/rich-editor"
import { type CreateQuestionPayload, type Question } from "../../lib/api/questions"

interface Props {
  defaultValues?: Partial<Question>
  onSubmit: (data: CreateQuestionPayload) => void
  isLoading: boolean
  submitLabel?: string
}

const DIFFICULTY_COLORS = {
  EASY: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  HARD: "bg-red-500/10 text-red-600 border-red-500/20",
} as const

export function QuestionForm({ defaultValues, onSubmit, isLoading, submitLabel = "Save" }: Props) {
  const [options, setOptions] = useState(
    defaultValues?.options?.map((o) => ({
      content: o.content,
      isCorrect: o.isCorrect,
      order: o.order,
      imageUrl: o.imageUrl,
    })) ?? [
      { content: "", isCorrect: false, order: 0 },
      { content: "", isCorrect: false, order: 1 },
      { content: "", isCorrect: false, order: 2 },
      { content: "", isCorrect: false, order: 3 },
    ],
  )

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    defaultValues?.difficulty ?? "MEDIUM",
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      type: fd.get("type") as CreateQuestionPayload["type"],
      subject: fd.get("subject") as string,
      topic: fd.get("topic") as string,
      subtopic: (fd.get("subtopic") as string) || undefined,
      difficulty,
      content: fd.get("content") as string,
      explanation: (fd.get("explanation") as string) || undefined,
      positiveMarks: Number(fd.get("positiveMarks")) || 4,
      negativeMarks: Number(fd.get("negativeMarks")) || 1,
      correctInteger: fd.get("correctInteger") ? Number(fd.get("correctInteger")) : undefined,
      options,
    })
  }

  const correctCount = options.filter((o) => o.isCorrect).length

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Row 1 — Classification + Marking side by side */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Classification */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Question Type</FieldLabel>
                  <NativeSelect name="type" defaultValue={defaultValues?.type ?? "MCQ"} required className="w-full">
                    <NativeSelectOption value="MCQ">MCQ — Single correct</NativeSelectOption>
                    <NativeSelectOption value="MSQ">MSQ — Multi select</NativeSelectOption>
                    <NativeSelectOption value="INTEGER">Integer answer</NativeSelectOption>
                    <NativeSelectOption value="SUBJECTIVE">Subjective</NativeSelectOption>
                  </NativeSelect>
                </Field>

                <Field>
                  <FieldLabel>Difficulty</FieldLabel>
                  <div className="flex gap-2">
                    {(["EASY", "MEDIUM", "HARD"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                          difficulty === d
                            ? DIFFICULTY_COLORS[d]
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {d[0] + d.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Subject</FieldLabel>
                  <Input name="subject" placeholder="Physics" required defaultValue={defaultValues?.subject} />
                </Field>
                <Field>
                  <FieldLabel>Topic</FieldLabel>
                  <Input name="topic" placeholder="Kinematics" required defaultValue={defaultValues?.topic} />
                </Field>
                <Field>
                  <FieldLabel>Subtopic</FieldLabel>
                  <Input name="subtopic" placeholder="Optional" defaultValue={defaultValues?.subtopic} />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Marking Scheme */}
        <Card className="shrink-0">
          <CardHeader className="border-b">
            <CardTitle>Marking</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Correct (+)</FieldLabel>
                <Input
                  name="positiveMarks"
                  type="number"
                  step="0.5"
                  min="0"
                  defaultValue={defaultValues?.positiveMarks ?? 4}
                />
                <FieldDescription>Awarded for correct</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Incorrect (−)</FieldLabel>
                <Input
                  name="negativeMarks"
                  type="number"
                  step="0.5"
                  min="0"
                  defaultValue={defaultValues?.negativeMarks ?? 1}
                />
                <FieldDescription>Deducted for wrong</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      {/* Section 3 — Content */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Question Content</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-4">
          <Field>
            <FieldLabel>Question Text</FieldLabel>
            <RichEditor
              name="content"
              placeholder="Enter question text — LaTeX supported via formula module"
              defaultValue={defaultValues?.content}
              minHeight={140}
              mode="full"
            />
          </Field>
          <Separator />
          <Field>
            <FieldLabel>
              Explanation
              <Badge variant="outline" className="ml-2 text-xs font-normal">optional</Badge>
            </FieldLabel>
            <RichEditor
              name="explanation"
              placeholder="Step-by-step solution shown after submission"
              defaultValue={defaultValues?.explanation}
              minHeight={100}
              mode="full"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Section 4 — Options */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Answer Options</CardTitle>
              {correctCount > 0 && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {correctCount} correct option{correctCount > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setOptions([...options, { content: "", isCorrect: false, order: options.length }])
              }
            >
              <IconPlus className="size-3.5" />
              Add option
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            {options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                  opt.isCorrect
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-transparent"
                }`}
              >
                {/* Correct toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = [...options]
                    next[i] = { ...next[i], isCorrect: !next[i].isCorrect }
                    setOptions(next)
                  }}
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    opt.isCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-border text-transparent hover:border-muted-foreground"
                  }`}
                  title={opt.isCorrect ? "Mark as incorrect" : "Mark as correct"}
                >
                  <IconCheck className="size-3.5" strokeWidth={3} />
                </button>

                {/* Option label */}
                <span className="w-5 shrink-0 text-center text-sm font-semibold text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </span>

                <Input
                  value={opt.content}
                  onChange={(e) => {
                    const next = [...options]
                    next[i] = { ...next[i], content: e.target.value }
                    setOptions(next)
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />

                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setOptions(options.filter((_, j) => j !== i))}
                  >
                    <IconTrash className="size-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
        <FieldTitle className="text-muted-foreground text-xs">
          All fields marked as required must be filled
        </FieldTitle>
      </div>
    </form>
  )
}
