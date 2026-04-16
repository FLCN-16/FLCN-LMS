import { IconArrowLeft } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@flcn-lms/ui/components/field";
import { Input } from "@flcn-lms/ui/components/input";
import { Switch } from "@flcn-lms/ui/components/switch";
import { Textarea } from "@flcn-lms/ui/components/textarea";
import { EntitySeoForm } from "@/components/entity-seo-form";
import { useCreateCourseCategory, } from "@/queries/courses";
export default function NewCourseCategoryPage() {
    const navigate = useNavigate();
    const createMutation = useCreateCourseCategory();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const seoKeywords = String(formData.get("seoKeywords") ?? "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
        const data = {
            slug: String(formData.get("slug") ?? ""),
            name: String(formData.get("name") ?? ""),
            description: String(formData.get("description") ?? "") || undefined,
            iconUrl: String(formData.get("iconUrl") ?? "") || undefined,
            seoTitle: String(formData.get("seoTitle") ?? "") || undefined,
            seoDescription: String(formData.get("seoDescription") ?? "") || undefined,
            seoKeywords: seoKeywords.length > 0 ? seoKeywords : undefined,
            seoImageUrl: String(formData.get("seoImageUrl") ?? "") || undefined,
            order: Number(formData.get("order") || 0),
            isActive: formData.get("isActive") === "on",
        };
        createMutation.mutate(data, {
            onSuccess: () => {
                navigate("/course-categories");
            },
        });
    };
    return (<>
      <Helmet>
        <title>New Course Category — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/course-categories">
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Course Category</h2>
            <p className="text-sm text-muted-foreground">
              Create a category for organizing courses
            </p>
          </div>
        </div>

        {createMutation.isError && (<p className="mb-4 text-sm text-destructive">
            Failed to create. Please try again.
          </p>)}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input name="name" placeholder="Engineering" required/>
                </Field>

                <Field>
                  <FieldLabel>Slug</FieldLabel>
                  <Input name="slug" placeholder="engineering" required/>
                </Field>

                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea name="description" rows={4} placeholder="Short category description"/>
                </Field>

                <Field>
                  <FieldLabel>Icon URL</FieldLabel>
                  <Input name="iconUrl" placeholder="https://example.com/icon.svg"/>
                </Field>

                <Field>
                  <FieldLabel>Order</FieldLabel>
                  <Input name="order" type="number" min="0" defaultValue={0}/>
                </Field>

                <Field className="flex items-center justify-between rounded-lg border p-3">
                  <FieldLabel htmlFor="isActive">Active</FieldLabel>
                  <Switch id="isActive" name="isActive" defaultChecked={true}/>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <EntitySeoForm entityLabel="Course Category"/>

          <div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </>);
}
