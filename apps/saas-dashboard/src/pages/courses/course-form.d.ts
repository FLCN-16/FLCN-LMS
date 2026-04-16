import { type Course, type CourseCategory, type CreateCourseInput } from "@/queries/courses";
interface CourseFormProps {
    categories: CourseCategory[];
    defaultValues?: Partial<Course>;
    onSubmit: (data: CreateCourseInput) => void;
    isLoading: boolean;
    submitLabel?: string;
}
export declare function CourseForm({ categories, defaultValues, onSubmit, isLoading, submitLabel, }: CourseFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=course-form.d.ts.map