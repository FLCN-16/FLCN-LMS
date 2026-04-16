import { IconArrowLeft } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@flcn-lms/ui/components/button";
import { Skeleton } from "@flcn-lms/ui/components/skeleton";
import { useCourseCategoriesList, useCourseDetail, useUpdateCourse, } from "@/queries/courses";
import { CourseForm } from "./course-form";
export default function EditCoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data: categories = [] } = useCourseCategoriesList();
    const { data: course, isLoading } = useCourseDetail({
        variables: { id: courseId },
        enabled: !!courseId,
    });
    const updateMutation = useUpdateCourse();
    return (<>
      <Helmet>
        <title>Edit Course — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/courses">
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Course</h2>
            <p className="text-sm text-muted-foreground">{course?.title}</p>
          </div>
        </div>

        {isLoading ? (<div className="flex max-w-xl flex-col gap-4">
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-24 w-full"/>
          </div>) : course ? (<CourseForm categories={categories} defaultValues={course} onSubmit={(data) => {
                if (!courseId)
                    return;
                updateMutation.mutate({ id: courseId, data }, {
                    onSuccess: () => {
                        navigate("/courses");
                    },
                });
            }} isLoading={updateMutation.isPending} submitLabel="Save Changes"/>) : (<p className="text-sm text-muted-foreground">Course not found.</p>)}
      </div>
    </>);
}
