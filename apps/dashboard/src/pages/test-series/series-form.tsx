import { useState } from "react"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@flcn-lms/ui/components/combobox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import { Separator } from "@flcn-lms/ui/components/separator"
import { Skeleton } from "@flcn-lms/ui/components/skeleton"
import { Textarea } from "@flcn-lms/ui/components/textarea"

import { EntitySeoForm } from "@/components/entity-seo-form"
import { useExamTypesList } from "@/queries/exam-types"
import {
  type CreateTestSeriesPayload,
  type TestSeries,
} from "@/queries/test-series"

import { DateTimePicker } from "../../components/date-time-picker"

interface Props {
  defaultValues?: Partial<TestSeries>
  onSubmit: (data: CreateTestSeriesPayload) => void
  isLoading: boolean
  submitLabel?: string
}

export function SeriesForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: Props) {
  const [isPaid, setIsPaid] = useState(defaultValues?.isPaid !== false)
  const [examType, setExamType] = useState<string>(
    defaultValues?.examType ?? ""
  )

  const { data: examTypes = [], isLoading: examTypesLoading } =
    useExamTypesList()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const seoKeywords = String(fd.get("seoKeywords") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
    onSubmit({
      slug: fd.get("slug") as string,
      title: fd.get("title") as string,
      description: (fd.get("description") as string) || undefined,
      examType,
      seoTitle: (fd.get("seoTitle") as string) || undefined,
      seoDescription: (fd.get("seoDescription") as string) || undefined,
      seoKeywords: seoKeywords.length > 0 ? seoKeywords : undefined,
      seoImageUrl: (fd.get("seoImageUrl") as string) || undefined,
      isPaid,
      price: isPaid && fd.get("price") ? Number(fd.get("price")) : undefined,
      validTill: (fd.get("validTill") as string) || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basic info */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                name="title"
                placeholder="JEE Mains 2025 Series"
                required
                defaultValue={defaultValues?.title}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input
                  name="slug"
                  placeholder="jee-mains-2025"
                  required
                  defaultValue={defaultValues?.slug}
                />
                <FieldDescription>
                  Used in URLs — lowercase, hyphens only
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Exam Type</FieldLabel>
                {examTypesLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <Combobox
                    value={examType}
                    onValueChange={(v) => setExamType(v ?? "")}
                  >
                    <ComboboxInput
                      placeholder="Search or type a custom type…"
                      showClear
                      className="w-full"
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxEmpty>No exam types found</ComboboxEmpty>
                        {examTypes.map((et) => (
                          <ComboboxItem key={et.id} value={et.slug}>
                            <span>{et.label}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {et.slug}
                            </span>
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
                <FieldDescription>
                  Pick from the list or type a custom exam type
                </FieldDescription>
              </Field>
            </div>

            <Field>
              <FieldLabel>
                Description
                <Badge variant="outline" className="ml-2 text-xs font-normal">
                  optional
                </Badge>
              </FieldLabel>
              <Textarea
                name="description"
                rows={3}
                placeholder="What's included in this series, target audience, etc."
                defaultValue={defaultValues?.description}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <EntitySeoForm entityLabel="Test Series" defaultValues={defaultValues} />

      {/* Pricing */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Pricing & Access</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Access Type</FieldLabel>
              <div className="flex gap-2">
                {[
                  { value: true, label: "Paid", desc: "Requires purchase" },
                  { value: false, label: "Free", desc: "Open to all" },
                ].map(({ value, label, desc }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setIsPaid(value)}
                    className={`flex flex-1 flex-col items-start rounded-lg border p-3 text-left transition-all ${
                      isPaid === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs opacity-70">{desc}</span>
                  </button>
                ))}
              </div>
            </Field>

            {isPaid && (
              <>
                <Separator />
                <Field>
                  <FieldLabel>Price (₹)</FieldLabel>
                  <div className="relative max-w-xs">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="999"
                      className="pl-7"
                      defaultValue={defaultValues?.price ?? ""}
                    />
                  </div>
                </Field>
              </>
            )}

            <DateTimePicker
              name="validTill"
              label="Valid Till"
              optional
              defaultValue={defaultValues?.validTill}
              description="Leave empty for no expiry"
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div>
        <Button type="submit" disabled={isLoading || !examType}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
