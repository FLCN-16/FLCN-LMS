import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@flcn-lms/ui/components/button";
import { Input } from "@flcn-lms/ui/components/input";
import { Label } from "@flcn-lms/ui/components/label";
import { useSuperAdmin, useCreateSuperAdmin, useUpdateSuperAdmin, } from "@/queries/super-admins";
function AdminFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { data: admin } = useSuperAdmin({ variables: { id: id }, enabled: isEdit });
    const createMutation = useCreateSuperAdmin();
    const updateMutation = useUpdateSuperAdmin();
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        values: isEdit && admin
            ? {
                name: admin.name,
                email: admin.email,
                password: "",
            }
            : {
                name: "",
                email: "",
                password: "",
            },
    });
    const onSubmit = async (data) => {
        try {
            if (isEdit && id) {
                await updateMutation.mutateAsync({
                    id,
                    data: { name: data.name, email: data.email },
                });
                toast.success("Admin updated successfully");
            }
            else {
                await createMutation.mutateAsync({
                    name: data.name,
                    email: data.email,
                    password: data.password || "",
                });
                toast.success("Admin created successfully");
            }
            navigate("/super-admins");
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
        <title>{isEdit ? "Edit" : "Create"} Admin — FLCN SaaS Admin</title>
      </Helmet>

      {/* Header Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
          <Link to="/super-admins" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            <ArrowLeft className="h-4 w-4"/>
            Back to Super Admins
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2.5">
              <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400"/>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {isEdit ? "Edit Admin" : "Create New Admin"}
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                {isEdit
            ? "Update system administrator details and access"
            : "Add a new system administrator with full platform access"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-lg border border-border bg-card p-6 md:p-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Controller control={control} name="name" rules={{ required: "Full name is required" }} render={({ field }) => (<Input {...field} id="name" placeholder="John Doe" className={`h-11 text-base ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`} disabled={isSubmitting}/>)}/>
                {renderFieldError(errors.name)}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Controller control={control} name="email" rules={{
            required: "Email is required",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
            },
        }} render={({ field }) => (<Input {...field} id="email" type="email" placeholder="admin@flcn.io" className={`h-11 text-base ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`} disabled={isSubmitting}/>)}/>
                {renderFieldError(errors.email)}
                {!isEdit && (<p className="text-xs text-muted-foreground">
                    This email will be used for login and communications
                  </p>)}
              </div>

              {/* Password Field (Create Only) */}
              {!isEdit && (<div className="space-y-3">
                  <Label htmlFor="password" className="text-base font-semibold text-foreground">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Controller control={control} name="password" rules={{
                required: "Password is required",
                minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                },
            }} render={({ field }) => (<Input {...field} id="password" type="password" placeholder="••••••••" className={`h-11 text-base ${errors.password
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""}`} disabled={isSubmitting}/>)}/>
                  {renderFieldError(errors.password)}
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>)}
            </div>

            {/* Divider */}
            <div className="h-px bg-border"/>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" asChild disabled={isSubmitting} className="h-11">
                <Link to="/super-admins">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending} className="h-11">
                {isSubmitting || createMutation.isPending || updateMutation.isPending
            ? "Saving..."
            : isEdit
                ? "Update Admin"
                : "Create Admin"}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 rounded-lg border border-border bg-gradient-to-r from-violet-50/50 to-amber-50/50 dark:from-violet-950/20 dark:to-amber-950/20 p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                🔒 Superadmin Access
              </p>
              <p className="text-sm text-muted-foreground">
                Admins created here have full system access. Only assign to trusted
                individuals responsible for platform operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
export default AdminFormPage;
