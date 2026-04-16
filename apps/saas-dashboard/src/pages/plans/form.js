import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Layers, AlertCircle, Plus, Trash2 } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@flcn-lms/ui/components/button";
import { Input } from "@flcn-lms/ui/components/input";
import { Label } from "@flcn-lms/ui/components/label";
import { Switch } from "@flcn-lms/ui/components/switch";
import { useCreatePlan, useUpdatePlan, usePlan, } from "@/queries/plans";
function PlanFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { data: plan } = usePlan({ variables: { id: id }, enabled: isEdit });
    const createMutation = useCreatePlan();
    const updateMutation = useUpdatePlan();
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        values: isEdit && plan
            ? {
                name: plan.name,
                description: plan.description || "",
                priceMonthly: plan.priceMonthly,
                priceYearly: plan.priceYearly,
                isActive: plan.isActive,
                features: Array.isArray(plan.features)
                    ? plan.features
                    : typeof plan.features === "object" && plan.features !== null
                        ? Object.entries(plan.features).map(([name, value]) => ({
                            name,
                            enabled: value?.enabled ?? false,
                            description: value?.description,
                            limit: value?.limit,
                        }))
                        : [],
            }
            : {
                name: "",
                description: "",
                priceMonthly: 0,
                priceYearly: 0,
                isActive: true,
                features: [],
            },
    });
    const { fields: featureFields, append, remove } = useFieldArray({
        control,
        name: "features",
    });
    const onSubmit = async (data) => {
        try {
            const submitData = {
                ...data,
                priceMonthly: Number(data.priceMonthly),
                priceYearly: Number(data.priceYearly),
                features: data.features?.reduce((acc, feature) => {
                    acc[feature.name] = {
                        enabled: feature.enabled,
                        description: feature.description,
                        limit: feature.limit,
                    };
                    return acc;
                }, {}),
            };
            if (isEdit && id) {
                await updateMutation.mutateAsync({
                    id,
                    data: submitData,
                });
                toast.success("Plan updated successfully");
            }
            else {
                await createMutation.mutateAsync(submitData);
                toast.success("Plan created successfully");
            }
            navigate("/plans");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred";
            toast.error(message);
        }
    };
    const renderFieldError = (error) => {
        if (!error)
            return null;
        return (<div className="flex items-center gap-2 text-sm text-destructive mt-2">
        <AlertCircle className="h-4 w-4"/>
        <span>{error.message}</span>
      </div>);
    };
    return (<div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>{isEdit ? "Edit" : "Create"} Plan — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
          <Link to="/plans" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            <ArrowLeft className="h-4 w-4"/>
            Back to Plans
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 p-2.5">
              <Layers className="h-6 w-6 text-violet-600 dark:text-violet-400"/>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {isEdit ? "Edit Plan" : "Create New Plan"}
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                {isEdit
            ? "Update plan details, pricing, and features"
            : "Create a new subscription plan with pricing tiers"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-lg border border-border bg-card p-6 md:p-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Plan Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold text-foreground">
                  Plan Name <span className="text-destructive">*</span>
                </Label>
                <Controller control={control} name="name" rules={{ required: "Plan name is required" }} render={({ field }) => (<Input {...field} id="name" placeholder="Pro Plan" className={`h-11 text-base ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`} disabled={isSubmitting}/>)}/>
                {renderFieldError(errors.name)}
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold text-foreground">
                  Description
                </Label>
                <Controller control={control} name="description" render={({ field }) => (<Input {...field} id="description" placeholder="Plan description" className="h-11 text-base" disabled={isSubmitting}/>)}/>
              </div>

              {/* Pricing Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Price */}
                <div className="space-y-3">
                  <Label htmlFor="priceMonthly" className="text-base font-semibold text-foreground">
                    Monthly Price <span className="text-destructive">*</span>
                  </Label>
                  <Controller control={control} name="priceMonthly" rules={{
            required: "Monthly price is required",
            min: { value: 0, message: "Price must be 0 or greater" },
        }} render={({ field }) => (<Input {...field} id="priceMonthly" type="number" step="0.01" placeholder="99.99" className={`h-11 text-base ${errors.priceMonthly ? "border-destructive focus-visible:ring-destructive" : ""}`} disabled={isSubmitting}/>)}/>
                  {renderFieldError(errors.priceMonthly)}
                </div>

                {/* Yearly Price */}
                <div className="space-y-3">
                  <Label htmlFor="priceYearly" className="text-base font-semibold text-foreground">
                    Yearly Price <span className="text-destructive">*</span>
                  </Label>
                  <Controller control={control} name="priceYearly" rules={{
            required: "Yearly price is required",
            min: { value: 0, message: "Price must be 0 or greater" },
        }} render={({ field }) => (<Input {...field} id="priceYearly" type="number" step="0.01" placeholder="999.99" className={`h-11 text-base ${errors.priceYearly ? "border-destructive focus-visible:ring-destructive" : ""}`} disabled={isSubmitting}/>)}/>
                  {renderFieldError(errors.priceYearly)}
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">
                    Plan Features
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", enabled: true, description: "" })} disabled={isSubmitting} className="gap-2">
                    <Plus className="h-4 w-4"/>
                    Add Feature
                  </Button>
                </div>

                {featureFields.length === 0 ? (<div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No features added yet. Click "Add Feature" to define plan capabilities.
                    </p>
                  </div>) : (<div className="space-y-4">
                    {featureFields.map((field, index) => (<div key={field.id} className="rounded-lg border border-border p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Feature Name */}
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor={`features.${index}.name`} className="text-sm">
                              Feature Name <span className="text-destructive">*</span>
                            </Label>
                            <Controller control={control} name={`features.${index}.name`} rules={{ required: "Feature name is required" }} render={({ field }) => (<Input {...field} id={`features.${index}.name`} placeholder="e.g., Live Sessions, Advanced Analytics" className="h-9 text-sm" disabled={isSubmitting}/>)}/>
                          </div>

                          {/* Feature Toggle */}
                          <div className="space-y-2">
                            <Label className="text-sm">Enabled</Label>
                            <div className="flex items-center h-9">
                              <Controller control={control} name={`features.${index}.enabled`} render={({ field }) => (<Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting}/>)}/>
                            </div>
                          </div>
                        </div>

                        {/* Feature Description & Limit */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`features.${index}.description`} className="text-sm">
                              Description
                            </Label>
                            <Controller control={control} name={`features.${index}.description`} render={({ field }) => (<Input {...field} id={`features.${index}.description`} placeholder="Brief description of this feature" className="h-9 text-sm" disabled={isSubmitting}/>)}/>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`features.${index}.limit`} className="text-sm">
                              Limit (optional)
                            </Label>
                            <Controller control={control} name={`features.${index}.limit`} render={({ field }) => (<Input {...field} id={`features.${index}.limit`} type="number" placeholder="e.g., 100 users, unlimited" className="h-9 text-sm" disabled={isSubmitting}/>)}/>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="flex justify-end pt-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={isSubmitting} className="text-destructive hover:text-destructive gap-2">
                            <Trash2 className="h-4 w-4"/>
                            Remove
                          </Button>
                        </div>
                      </div>))}
                  </div>)}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border"/>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" asChild disabled={isSubmitting} className="h-11">
                <Link to="/plans">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending} className="h-11">
                {isSubmitting || createMutation.isPending || updateMutation.isPending
            ? "Saving..."
            : isEdit
                ? "Update Plan"
                : "Create Plan"}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 rounded-lg border border-border bg-gradient-to-r from-violet-50/50 to-amber-50/50 dark:from-violet-950/20 dark:to-amber-950/20 p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                💡 Pricing Guidance
              </p>
              <p className="text-sm text-muted-foreground">
                Set monthly and yearly prices separately. Yearly pricing typically offers 15-20% discount compared to 12 months of monthly pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
export default PlanFormPage;
