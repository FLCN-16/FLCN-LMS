import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { useCourseCategoriesList } from "@/queries/courses";
export default function CourseCategoriesPage() {
    const { data: categories = [], isLoading } = useCourseCategoriesList();
    return (<>
      <Helmet>
        <title>Course Categories — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Course Categories</h2>
            <p className="text-sm text-muted-foreground">
              {categories.length} categories from the backend
            </p>
          </div>

          <Button size="sm" asChild>
            <Link to="/course-categories/new">
              <IconPlus className="size-4"/>
              New Category
            </Link>
          </Button>
        </div>

        {isLoading ? (<p className="text-sm text-muted-foreground">Loading categories...</p>) : categories.length === 0 ? (<p className="text-sm text-muted-foreground">
            No course categories are available yet.
          </p>) : (<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (<Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">
                        {category.name}
                      </CardTitle>
                      <p className="font-mono text-xs text-muted-foreground">
                        {category.slug}
                      </p>
                    </div>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {category.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/course-categories/${category.id}/edit`}>
                        <IconPencil className="size-3.5"/>
                        Edit
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Order {category.order}</span>
                    <span>
                      Updated{" "}
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>))}
          </div>)}
      </div>
    </>);
}
