import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Key, AlertCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@flcn-lms/ui/components/button";
import { Input } from "@flcn-lms/ui/components/input";
import { Label } from "@flcn-lms/ui/components/label";
import { useIssueLicense, useUpdateLicense, useLicense, } from "@/queries/licenses";
function LicenseFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { data: license } = useLicense({ variables: { id: id }, enabled: isEdit });
    const issueMutation = useIssueLicense();
    const updateMutation = useUpdateLicense();
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        values: isEdit && license
            ? {
                organizationName: license.organizationName,
                maxUsers: license.maxUsers,
                expiryDate: license.expiryDate
                    ? new Date(license.expiryDate).toISOString().split("T")[0]
                    : "",
                notes: "",
            }
            : {
                organizationName: "",
                maxUsers: undefined,
                expiryDate: "",
                notes: "",
            },
    });
    const onSubmit = async (data) => {
        try {
            const submitData = {
                organizationName: data.organizationName,
                maxUsers: data.maxUsers ? Number(data.maxUsers) : undefined,
                expiryDate: data.expiryDate,
            };
            if (isEdit && id) {
                await updateMutation.mutateAsync({
                    id,
                    data: submitData,
                });
                toast.success("License updated successfully");
            }
            else {
                // Backend will auto-generate the license key
                await issueMutation.mutateAsync({
                    organizationName: submitData.organizationName,
                    licenseKey: "", // Backend will generate this
                    maxUsers: submitData.maxUsers,
                    expiryDate: submitData.expiryDate,
                });
                toast.success("License issued successfully");
            }
            navigate("/licenses");
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
        <title>{isEdit ? "Edit" : "Issue"} License — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
          <Link to="/licenses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            <ArrowLeft className="h-4 w-4"/>
            Back to Licenses
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2.5">
              <Key className="h-6 w-6 text-amber-600 dark:text-amber-400"/>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {isEdit ? "Edit License" : "Issue New License"}
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                {isEdit
            ? "Modify license settings and expiration"
            : "Create and assign a new license to an organization"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-lg border border-border bg-card p-6 md:p-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Organization Name Field */}
              <div className="space-y-3">
                <Label htmlFor="organizationName" className="text-base font-semibold text-foreground">
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Controller control={control} name="organizationName" rules={{ required: "Organization name is required" }} render={({ field }) => (<Input {...field} id="organizationName" placeholder="Acme Corporation" className={`h-11 text-base ${errors.organizationName ? "border-destructive focus-visible:ring-destructive" : ""}`} disabled={isSubmitting}/>)}/>
                {renderFieldError(errors.organizationName)}
              </div>

              {/* Max Users Field */}
              <div className="space-y-3">
                <Label htmlFor="maxUsers" className="text-base font-semibold text-foreground">
                  Max Users
                </Label>
                <Controller control={control} name="maxUsers" render={({ field }) => (<Input {...field} id="maxUsers" type="number" placeholder="Unlimited" className="h-11 text-base" disabled={isSubmitting}/>)}/>
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited users
                </p>
              </div>

              {/* Expiry Date Field */}
              <div className="space-y-3">
                <Label htmlFor="expiryDate" className="text-base font-semibold text-foreground">
                  Expiry Date
                </Label>
                <Controller control={control} name="expiryDate" render={({ field }) => (<Input {...field} id="expiryDate" type="date" className="h-11 text-base" disabled={isSubmitting}/>)}/>
                <p className="text-xs text-muted-foreground">
                  Leave empty for perpetual license
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border"/>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" asChild disabled={isSubmitting} className="h-11">
                <Link to="/licenses">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || issueMutation.isPending || updateMutation.isPending} className="h-11">
                {isSubmitting || issueMutation.isPending || updateMutation.isPending
            ? "Saving..."
            : isEdit
                ? "Update License"
                : "Issue License"}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 rounded-lg border border-border bg-gradient-to-r from-amber-50/50 to-violet-50/50 dark:from-amber-950/20 dark:to-violet-950/20 p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                🔐 License Security
              </p>
              <p className="text-sm text-muted-foreground">
                License keys are automatically generated by the system. You can view the generated key in the license details after creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
export default LicenseFormPage;
