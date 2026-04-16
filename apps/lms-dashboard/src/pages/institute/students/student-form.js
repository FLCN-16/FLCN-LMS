import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@flcn-lms/ui/components/button";
import { Input } from "@flcn-lms/ui/components/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError, } from "@flcn-lms/ui/components/field";
import { NativeSelect, NativeSelectOption, } from "@flcn-lms/ui/components/native-select";
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
    role: z.enum(["student", "instructor", "admin"]),
    isActive: z.boolean(),
});
export function StudentForm({ initialData, onSubmit, isLoading }) {
    const { register, handleSubmit, control, formState: { errors }, } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            email: initialData?.email ?? "",
            phone: initialData?.phone ?? "",
            role: initialData?.role ?? "student",
            isActive: Boolean(initialData?.isActive ?? true),
        },
    });
    return (<form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input placeholder="John Doe" {...register("name")} data-invalid={!!errors.name}/>
          <FieldError errors={[errors.name]}/>
        </Field>

        <Field>
          <FieldLabel>Email Address</FieldLabel>
          <Input placeholder="john@example.com" {...register("email")} disabled={!!initialData} data-invalid={!!errors.email}/>
          <FieldDescription>
            Used for login. Cannot be changed later.
          </FieldDescription>
          <FieldError errors={[errors.email]}/>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Controller name="role" control={control} render={({ field }) => (<NativeSelect {...field} data-invalid={!!errors.role}>
                  <NativeSelectOption value="student">Student</NativeSelectOption>
                  <NativeSelectOption value="instructor">Instructor</NativeSelectOption>
                  <NativeSelectOption value="admin">Admin</NativeSelectOption>
                </NativeSelect>)}/>
            <FieldError errors={[errors.role]}/>
          </Field>

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input placeholder="+1234567890" {...register("phone")} data-invalid={!!errors.phone}/>
            <FieldError errors={[errors.phone]}/>
          </Field>
        </div>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
        {initialData ? "Update User" : "Create User"}
      </Button>
    </form>);
}
