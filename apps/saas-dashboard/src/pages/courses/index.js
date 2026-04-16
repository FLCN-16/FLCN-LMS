import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { useCourseCategoriesList, useCoursesList } from "@/queries/courses";
function formatPrice(value) {
    if (value == null) {
        return "Free";
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}
export default function CoursesPage() {
    const { data: courses = [], isLoading } = useCoursesList();
    const { data: categories = [] } = useCourseCategoriesList();
    return (<>
      <Helmet>
        <title>Courses — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Courses</h2>
            <p className="text-sm text-muted-foreground">
              {courses.length} courses from the backend
            </p>
          </div>

          <Button size="sm" asChild disabled={categories.length === 0}>
            <Link to="/courses/new">
              <IconPlus className="size-4"/>
              New Course
            </Link>
          </Button>
        </div>

        {categories.length === 0 && (<p className="mb-4 text-sm text-muted-foreground">
            Create at least one course category before adding a course.
          </p>)}

        {isLoading ? (<p className="text-sm text-muted-foreground">Loading courses...</p>) : courses.length === 0 ? (<p className="text-sm text-muted-foreground">
            No courses are available yet.
          </p>) : (<div className="grid gap-4 xl:grid-cols-2">
            {courses.map((course) => (<Card key={course.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {course.title}
                      </CardTitle>
                      <p className="font-mono text-xs text-muted-foreground">
                        {course.slug}
                      </p>
                    </div>
                    <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {course.description || "No course description provided."}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/courses/${course.id}/edit`}>
                        <IconPencil className="size-3.5"/>
                        Edit
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">
                        {course.category?.name || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Access</p>
                      <p className="font-medium">
                        {course.isPaid ? formatPrice(course.price) : "Free"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Students</p>
                      <p className="font-medium">{course.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lessons</p>
                      <p className="font-medium">{course.totalLessons}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{course.modules?.length ?? 0} modules</span>
                    <span>Rating {Number(course.rating).toFixed(1)}</span>
                    <span>
                      Updated {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>))}
          </div>)}
      </div>
    </>);
}
