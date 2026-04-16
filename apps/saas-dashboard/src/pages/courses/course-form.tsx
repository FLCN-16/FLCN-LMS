import {
  CheckmarkCircle02Icon,
  Image01Icon,
  Link02Icon,
  PlayIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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

import { EntitySeoForm } from "@/components/entity-seo-form"
import { RichEditor } from "@/components/rich-editor"
import {
  type Course,
  type CourseCategory,
  type CreateCourseInput,
} from "@/queries/courses"

interface CourseFormProps {
  categories: CourseCategory[]
  defaultValues?: Partial<Course>
  onSubmit: (data: CreateCourseInput) => void
  isLoading: boolean
  submitLabel?: string
}

export function CourseForm({
  categories,
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save course",
}: CourseFormProps) {
  const [isPaid, setIsPaid] = useState(defaultValues?.isPaid ?? false)
  const [title, setTitle] = useState(defaultValues?.title ?? "")
  const [slug, setSlug] = useState(defaultValues?.slug ?? "")
  const [description] = useState(defaultValues?.description ?? "")
  const [thumbnailUrl, setThumbnailUrl] = useState(
    defaultValues?.thumbnailUrl ?? ""
  )
  const [trailerUrl, setTrailerUrl] = useState(defaultValues?.trailerUrl ?? "")
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? "")
  const [status, setStatus] = useState<CreateCourseInput["status"]>(
    defaultValues?.status ?? "DRAFT"
  )
  const [price, setPrice] = useState(
    defaultValues?.price ? String(defaultValues.price) : ""
  )
  const [discountPrice, setDiscountPrice] = useState(
    defaultValues?.discountPrice ? String(defaultValues.discountPrice) : ""
  )
  const [validityDays, setValidityDays] = useState(
    defaultValues?.validityDays ? String(defaultValues.validityDays) : ""
  )

  const highlightsDefault = defaultValues?.highlights?.join("\n") ?? ""
  const highlightsPreview = highlightsDefault
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean)

  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  )

  const isFormValid = Boolean(title.trim() && categoryId && (!isPaid || price))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const highlights = String(formData.get("highlights") ?? "")
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
    const seoKeywords = String(formData.get("seoKeywords") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)

    onSubmit({
      categoryId: String(formData.get("categoryId") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      thumbnailUrl: String(formData.get("thumbnailUrl") ?? "") || undefined,
      trailerUrl: String(formData.get("trailerUrl") ?? "") || undefined,
      seoTitle: String(formData.get("seoTitle") ?? "") || undefined,
      seoDescription: String(formData.get("seoDescription") ?? "") || undefined,
      seoKeywords: seoKeywords.length > 0 ? seoKeywords : undefined,
      seoImageUrl: String(formData.get("seoImageUrl") ?? "") || undefined,
      status: (String(formData.get("status") ?? "DRAFT") ||
        "DRAFT") as CreateCourseInput["status"],
      isPaid,
      price: isPaid ? Number(formData.get("price") || 0) : undefined,
      discountPrice: isPaid
        ? Number(formData.get("discountPrice") || 0) || undefined
        : undefined,
      validityDays: Number(formData.get("validityDays") || 0) || undefined,
      highlights: highlights.length > 0 ? highlights : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="pb-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Main Content Column */}
        <div className="space-y-6">
          {/* Course Basics */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 pb-3">
              <CardTitle className="text-lg">Course basics</CardTitle>
              <CardDescription>
                Title, slug, and foundational information.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <FieldGroup>
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    name="title"
                    placeholder="Full Stack Bootcamp"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel>Slug</FieldLabel>
                  <Input
                    name="slug"
                    placeholder="full-stack-bootcamp"
                    required
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                  />
                  <FieldDescription>
                    URL-friendly identifier for course links.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 pb-3">
              <CardTitle className="text-lg">Description</CardTitle>
              <CardDescription>
                Rich text content about what students will learn.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <Field>
                <RichEditor
                  name="description"
                  defaultValue={description}
                  placeholder="Write a compelling course description..."
                  mode="full"
                  minHeight={240}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Media & Highlights */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 pb-3">
              <CardTitle className="text-lg">Media & highlights</CardTitle>
              <CardDescription>
                Thumbnail, trailer, and key course benefits.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
                {/* Form inputs */}
                <FieldGroup>
                  <Field>
                    <FieldLabel>Thumbnail URL</FieldLabel>
                    <Input
                      name="thumbnailUrl"
                      type="url"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={thumbnailUrl}
                      onChange={(event) => setThumbnailUrl(event.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Trailer URL</FieldLabel>
                    <Input
                      name="trailerUrl"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={trailerUrl}
                      onChange={(event) => setTrailerUrl(event.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Highlights</FieldLabel>
                    <RichEditor
                      name="highlights"
                      placeholder={
                        "Live mentor support\nStructured curriculum\n30+ projects"
                      }
                      defaultValue={highlightsDefault}
                      minHeight={120}
                      mode="basic"
                    />
                    <FieldDescription>
                      One per line or formatted in HTML.
                    </FieldDescription>
                  </Field>
                </FieldGroup>

                {/* Live preview */}
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <HugeiconsIcon icon={Image01Icon} className="size-4" />
                    Preview
                  </div>

                  <div className="overflow-hidden rounded-lg border bg-background">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={title || "Thumbnail"}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted/40 text-xs text-muted-foreground">
                        Thumbnail
                      </div>
                    )}
                  </div>

                  {trailerUrl && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={PlayIcon} className="size-3" />
                      <span className="truncate">Trailer added</span>
                    </div>
                  )}

                  {highlightsPreview.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        Promise
                      </p>
                      <div className="space-y-1.5 text-xs">
                        {highlightsPreview.slice(0, 3).map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-start gap-2"
                          >
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              className="mt-0.5 size-3 flex-shrink-0 text-primary"
                            />
                            <span className="line-clamp-2">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 pb-3">
              <CardTitle className="text-lg">Pricing</CardTitle>
              <CardDescription>
                Free or paid enrollment with optional discount.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <FieldGroup>
                <Field className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <FieldLabel htmlFor="isPaid" className="mb-1">
                        Paid course
                      </FieldLabel>
                      <p className="text-xs text-muted-foreground">
                        Require payment before access.
                      </p>
                    </div>
                    <Switch
                      id="isPaid"
                      checked={isPaid}
                      onCheckedChange={setIsPaid}
                    />
                  </div>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Price</FieldLabel>
                    <Input
                      name="price"
                      type="number"
                      min="0"
                      placeholder={isPaid ? "₹4999" : "N/A"}
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      disabled={!isPaid}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>
                      Discount price
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs font-normal"
                      >
                        optional
                      </Badge>
                    </FieldLabel>
                    <Input
                      name="discountPrice"
                      type="number"
                      min="0"
                      placeholder="₹3999"
                      value={discountPrice}
                      onChange={(event) => setDiscountPrice(event.target.value)}
                      disabled={!isPaid}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>
                    Validity (days)
                    <Badge
                      variant="outline"
                      className="ml-2 text-xs font-normal"
                    >
                      optional
                    </Badge>
                  </FieldLabel>
                  <Input
                    name="validityDays"
                    type="number"
                    min="0"
                    placeholder="365"
                    value={validityDays}
                    onChange={(event) => setValidityDays(event.target.value)}
                  />
                  <FieldDescription>
                    Leave empty for indefinite access.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* SEO */}
          <EntitySeoForm entityLabel="Course" defaultValues={defaultValues} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          {/* Status, Category & Summary - Single Card */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 pb-3">
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {/* Status */}
              <div>
                <FieldLabel className="mb-2 block text-xs">Status</FieldLabel>
                <NativeSelect
                  name="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as CreateCourseInput["status"])
                  }
                  className="w-full"
                >
                  <NativeSelectOption value="DRAFT">Draft</NativeSelectOption>
                  <NativeSelectOption value="REVIEW">
                    In Review
                  </NativeSelectOption>
                  <NativeSelectOption value="PUBLISHED">
                    Published
                  </NativeSelectOption>
                  <NativeSelectOption value="ARCHIVED">
                    Archived
                  </NativeSelectOption>
                </NativeSelect>
                <div className="mt-2 rounded-lg border bg-background p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">State</span>
                    <Badge variant={getStatusBadgeVariant(status)}>
                      {getStatusLabel(status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="border-t pt-4">
                <FieldLabel className="mb-2 block text-xs">Category</FieldLabel>
                <NativeSelect
                  name="categoryId"
                  required
                  className="w-full"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <NativeSelectOption value="">
                    Select a category
                  </NativeSelectOption>
                  {categories.map((category) => (
                    <NativeSelectOption key={category.id} value={category.id}>
                      {category.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              {/* Summary Preview */}
              <div className="space-y-3 border-t pt-4">
                {/* Title & Category */}
                <div className="rounded-lg border bg-background p-2.5">
                  <p className="line-clamp-2 text-xs font-semibold">
                    {title || "Untitled course"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedCategory?.name || "No category"}
                  </p>
                </div>

                {/* Key Info Grid */}
                <div className="grid gap-2 text-xs">
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                      Access
                    </p>
                    <p className="mt-1 font-semibold">
                      {isPaid ? "Paid" : "Free"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                      Price
                    </p>
                    <p className="mt-1 font-semibold">
                      {isPaid && price ? `₹${price}` : "—"}
                    </p>
                  </div>

                  {discountPrice && (
                    <div className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">
                        Sale
                      </p>
                      <p className="mt-1 font-semibold">₹{discountPrice}</p>
                    </div>
                  )}
                </div>

                {/* URL */}
                <div className="rounded-lg border bg-background p-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={Link02Icon} className="size-3" />
                    <span className="truncate font-mono text-xs">
                      {slug ? `/courses/${slug}` : "No URL"}
                    </span>
                  </div>
                </div>

                {/* Readiness Checklist */}
                <div className="rounded-lg border border-dashed p-2">
                  <p className="mb-2 text-xs font-semibold tracking-wide uppercase">
                    Ready?
                  </p>
                  <div className="space-y-1 text-xs">
                    <ChecklistItem
                      checked={Boolean(title.trim())}
                      label="Title"
                    />
                    <ChecklistItem
                      checked={Boolean(categoryId)}
                      label="Category"
                    />
                    <ChecklistItem
                      checked={!isPaid || Boolean(price)}
                      label="Pricing"
                    />
                    <ChecklistItem
                      checked={Boolean(description.trim())}
                      label="Description"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="overflow-hidden">
            <CardContent className="pt-5">
              {categories.length === 0 && (
                <p className="mb-3 text-xs text-muted-foreground">
                  Create a category first.
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !isFormValid || categories.length === 0}
              >
                {isLoading ? "Saving..." : submitLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

function getStatusLabel(status: string | undefined): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    REVIEW: "In Review",
    PUBLISHED: "Live",
    ARCHIVED: "Archived",
  }
  return labels[status || ""] || "Draft"
}

function getStatusBadgeVariant(
  status: string | undefined
): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    DRAFT: "secondary",
    REVIEW: "outline",
    PUBLISHED: "default",
    ARCHIVED: "destructive",
  }
  return variants[status || ""] || "outline"
}

function ChecklistItem({
  checked,
  label,
}: {
  checked: boolean
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          className="size-3.5 flex-shrink-0 text-green-600"
        />
      ) : (
        <div className="size-3.5 flex-shrink-0 rounded-full border border-dashed border-muted-foreground" />
      )}
      <span className={checked ? "font-medium" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  )
}
