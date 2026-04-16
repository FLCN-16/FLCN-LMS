import { IconArrowLeft } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@flcn-lms/ui/components/button";
import { useCourseCategoriesList, useCreateCourse, } from "@/queries/courses";
import { CourseForm } from "./course-form";
export default function NewCoursePage() {
    const navigate = useNavigate();
    const { data: categories = [] } = useCourseCategoriesList();
    const createMutation = useCreateCourse();
    const handleSubmit = (data) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                navigate("/courses");
            },
        });
    };
    return (<>
      <Helmet>
        <title>New Course — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/courses">
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Course</h2>
            <p className="text-sm text-muted-foreground">
              Create a new course offering
            </p>
          </div>
        </div>

        {categories.length === 0 && (<p className="mb-4 text-sm text-muted-foreground">
            Create a course category before adding a course.
          </p>)}

        {createMutation.isError && (<p className="mb-4 text-sm text-destructive">
            Failed to create. Please try again.
          </p>)}

        <CourseForm categories={categories} onSubmit={handleSubmit} isLoading={createMutation.isPending} submitLabel="Create Course"/>
      </div>
    </>);
}
