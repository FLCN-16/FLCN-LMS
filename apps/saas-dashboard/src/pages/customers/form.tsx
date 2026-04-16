import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Building2, AlertCircle, Image, Settings } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@flcn-lms/ui/components/button"
import { Input } from "@flcn-lms/ui/components/input"
import { Label } from "@flcn-lms/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flcn-lms/ui/components/select"
import { Switch } from "@flcn-lms/ui/components/switch"
import {
  useCreateCustomer,
  useUpdateCustomer,
  useCustomer,
} from "@/queries/customers"
import { usePlans } from "@/queries/plans"

interface CustomerFormData {
  name: string
  slug: string
  email?: string
  customDomain?: string
  logoUrl?: string
  planId?: string
  maxUsers?: number
  maxCourses?: number
  maxStorageGb?: number
  isActive?: boolean
}

function CustomerFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const { data: customer } = useCustomer({ variables: { id: id! }, enabled: isEdit })
  const { data: plans = [] } = usePlans()
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CustomerFormData>({
    values: isEdit && customer
      ? {
          name: customer.name,
          slug: customer.slug,
          email: customer.email || "",
          customDomain: customer.customDomain || "",
          logoUrl: customer.logoUrl || "",
          planId: customer.planId || "",
          maxUsers: customer.maxUsers,
          maxCourses: customer.maxCourses,
          maxStorageGb: customer.maxStorageGb,
          isActive: customer.isActive ?? true,
        }
      : {
          name: "",
          slug: "",
          email: "",
          customDomain: "",
          logoUrl: "",
          planId: "",
          maxUsers: 100,
          maxCourses: 50,
          maxStorageGb: 10,
          isActive: true,
        },
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const submitData = {
        name: data.name,
        slug: data.slug,
        email: data.email,
        customDomain: data.customDomain,
        logoUrl: data.logoUrl,
        planId: data.planId || undefined,
        maxUsers: data.maxUsers ? Number(data.maxUsers) : 100,
        maxCourses: data.maxCourses ? Number(data.maxCourses) : 50,
        maxStorageGb: data.maxStorageGb ? Number(data.maxStorageGb) : 10,
        isActive: data.isActive ?? true,
      }

      if (isEdit && id) {
        await updateMutation.mutateAsync({
          id,
          data: submitData,
        })
        toast.success("Customer updated successfully")
      } else {
        await createMutation.mutateAsync(submitData)
        toast.success("Customer created successfully")
      }
      navigate("/customers")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred"
      toast.error(message)
    }
  }

  const renderFieldError = (error: any) => {
    if (!error) return null
    return (
      <div className="flex items-center gap-2 text-sm text-destructive mt-2">
        <AlertCircle className="h-4 w-4" />
        <span>{error.message}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>{isEdit ? "Edit" : "Create"} Customer — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-50 dark:bg-cyan-950/30 p-2.5">
              <Building2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {isEdit ? "Edit Customer" : "Create New Customer"}
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                {isEdit
                  ? "Update customer organization details, plan, and resource limits"
                  : "Add a new organization with subscription plan and resource allocation"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-lg border border-border bg-card p-6 md:p-8"
          >
            {/* Section 1: Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <Building2 className="h-5 w-5 text-foreground" />
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>

              {/* Name Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-base font-semibold text-foreground"
                >
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Organization name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Physics Wallah"
                      className={`h-11 text-base ${
                        errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                  )}
                />
                {renderFieldError(errors.name)}
              </div>

              {/* Slug Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="slug"
                  className="text-base font-semibold text-foreground"
                >
                  Slug (Instance Identifier) <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="slug"
                  rules={{
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: "Slug must be lowercase alphanumeric with hyphens only",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="slug"
                      placeholder="pw-live"
                      className={`h-11 text-base font-mono ${
                        errors.slug ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                      disabled={isEdit || isSubmitting}
                    />
                  )}
                />
                {renderFieldError(errors.slug)}
                <p className="text-xs text-muted-foreground">
                  Unique identifier for customer LMS instance. Used in subdomain: <strong>{watch("slug") || "slug"}.example.com</strong>. Cannot be changed after creation.
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-base font-semibold text-foreground"
                >
                  Contact Email
                </Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="contact@example.com"
                      className="h-11 text-base"
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>

              {/* Custom Domain Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="customDomain"
                  className="text-base font-semibold text-foreground"
                >
                  Custom Domain (White-label)
                </Label>
                <Controller
                  control={control}
                  name="customDomain"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="customDomain"
                      placeholder="learning.example.com"
                      className="h-11 text-base"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Optional custom domain for branded access. Users can access via this domain instead of subdomain.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Section 2: Subscription & Limits */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <Settings className="h-5 w-5 text-foreground" />
                <h2 className="text-lg font-semibold">Subscription & Resource Limits</h2>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <Label
                  htmlFor="planId"
                  className="text-base font-semibold text-foreground"
                >
                  Subscription Plan
                </Label>
                <Controller
                  control={control}
                  name="planId"
                  render={({ field }) => (
                    <Select value={field.value || "none"} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
                      <SelectTrigger id="planId" className="h-11 text-base">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Plan (Self-managed limits)</SelectItem>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} — ${plan.priceMonthly}/mo
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Selected plan determines feature set. Manual limits below override plan defaults.
                </p>
              </div>

              {/* Max Users */}
              <div className="space-y-3">
                <Label
                  htmlFor="maxUsers"
                  className="text-base font-semibold text-foreground"
                >
                  Maximum Users
                </Label>
                <Controller
                  control={control}
                  name="maxUsers"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="maxUsers"
                      type="number"
                      placeholder="100"
                      className="h-11 text-base"
                      disabled={isSubmitting}
                      min="1"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of student + faculty accounts allowed
                </p>
              </div>

              {/* Max Courses */}
              <div className="space-y-3">
                <Label
                  htmlFor="maxCourses"
                  className="text-base font-semibold text-foreground"
                >
                  Maximum Courses
                </Label>
                <Controller
                  control={control}
                  name="maxCourses"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="maxCourses"
                      type="number"
                      placeholder="50"
                      className="h-11 text-base"
                      disabled={isSubmitting}
                      min="1"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of courses customer can create
                </p>
              </div>

              {/* Max Storage */}
              <div className="space-y-3">
                <Label
                  htmlFor="maxStorageGb"
                  className="text-base font-semibold text-foreground"
                >
                  Maximum Storage (GB)
                </Label>
                <Controller
                  control={control}
                  name="maxStorageGb"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="maxStorageGb"
                      type="number"
                      placeholder="10"
                      className="h-11 text-base"
                      disabled={isSubmitting}
                      min="1"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum storage for videos, documents, and media
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Section 3: Branding */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <Image className="h-5 w-5 text-foreground" />
                <h2 className="text-lg font-semibold">Branding</h2>
              </div>

              {/* Logo URL */}
              <div className="space-y-3">
                <Label
                  htmlFor="logoUrl"
                  className="text-base font-semibold text-foreground"
                >
                  Logo URL
                </Label>
                <Controller
                  control={control}
                  name="logoUrl"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="logoUrl"
                      placeholder="https://cdn.example.com/logo.png"
                      className="h-11 text-base"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  URL to organization logo (recommended: 200x50px PNG/SVG)
                </p>
                {watch("logoUrl") && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <img
                      src={watch("logoUrl")}
                      alt="Logo preview"
                      className="h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Section 4: Status */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <AlertCircle className="h-5 w-5 text-foreground" />
                <h2 className="text-lg font-semibold">Status</h2>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label
                    htmlFor="isActive"
                    className="text-base font-semibold text-foreground cursor-pointer"
                  >
                    Active
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {watch("isActive") ? "Customer can access platform" : "Customer is suspended"}
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch
                      id="isActive"
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                asChild
                disabled={isSubmitting}
                className="h-11"
              >
                <Link to="/customers">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="h-11"
              >
                {isSubmitting || createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEdit
                    ? "Update Customer"
                    : "Create Customer"}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 rounded-lg border border-border bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                📋 About Customer Configuration
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Each customer gets a dedicated LMS deployment with their own database</li>
                <li>Slug is the unique routing identifier (cannot be changed after creation)</li>
                <li>Plan selection determines available features and pricing</li>
                <li>Resource limits define max users, courses, and storage for that instance</li>
                <li>Customer LMS verifies its license with SaaS backend every 24 hours</li>
                <li>Deactivating suspends access to the customer's LMS platform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerFormPage
