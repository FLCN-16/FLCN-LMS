import { type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { type User } from "@/queries/users";
declare const formSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    role: z.ZodEnum<["student", "instructor", "admin"]>;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    role: "admin" | "instructor" | "student";
    email: string;
    isActive: boolean;
    phone?: string | undefined;
}, {
    name: string;
    role: "admin" | "instructor" | "student";
    email: string;
    isActive: boolean;
    phone?: string | undefined;
}>;
type FormValues = z.infer<typeof formSchema>;
interface StudentFormProps {
    initialData?: User;
    onSubmit: SubmitHandler<FormValues>;
    isLoading?: boolean;
}
export declare function StudentForm({ initialData, onSubmit, isLoading }: StudentFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=student-form.d.ts.map