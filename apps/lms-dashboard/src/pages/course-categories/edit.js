import { IconArrowLeft } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@flcn-lms/ui/components/field";
import { Input } from "@flcn-lms/ui/components/input";
import { Skeleton } from "@flcn-lms/ui/components/skeleton";
import { Switch } from "@flcn-lms/ui/components/switch";
import { Textarea } from "@flcn-lms/ui/components/textarea";
import { EntitySeoForm } from "@/components/entity-seo-form";
import { useCourseCategoryDetail, useUpdateCourseCategory, } from "@/queries/courses";
export default function EditCourseCategoryPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { data: category, isLoading } = useCourseCategoryDetail({
        variables: { id: categoryId },
        enabled: !!categoryId,
    });
    const updateMutation = useUpdateCourseCategory();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categoryId)
            return;
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
        updateMutation.mutate({ id: categoryId, data }, {
            onSuccess: () => {
                navigate("/course-categories");
            },
        });
    };
    return (<>
      <Helmet>
        <title>Edit Course Category — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/course-categories">
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Course Category</h2>
            <p className="text-sm text-muted-foreground">{category?.name}</p>
          </div>
        </div>

        {isLoading ? (<div className="flex max-w-xl flex-col gap-4">
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-24 w-full"/>
          </div>) : category ? (<form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input name="name" placeholder="Engineering" required defaultValue={category.name}/>
                  </Field>

                  <Field>
                    <FieldLabel>Slug</FieldLabel>
                    <Input name="slug" placeholder="engineering" required defaultValue={category.slug}/>
                  </Field>

                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea name="description" rows={4} placeholder="Short category description" defaultValue={category.description ?? ""}/>
                  </Field>

                  <Field>
                    <FieldLabel>Icon URL</FieldLabel>
                    <Input name="iconUrl" placeholder="https://example.com/icon.svg" defaultValue={category.iconUrl ?? ""}/>
                  </Field>

                  <Field>
                    <FieldLabel>Order</FieldLabel>
                    <Input name="order" type="number" min="0" defaultValue={category.order ?? 0}/>
                  </Field>

                  <Field className="flex items-center justify-between rounded-lg border p-3">
                    <FieldLabel htmlFor="isActive">Active</FieldLabel>
                    <Switch id="isActive" name="isActive" defaultChecked={category.isActive ?? true}/>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <EntitySeoForm entityLabel="Course Category" defaultValues={category}/>

            <div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>) : (<p className="text-sm text-muted-foreground">Category not found.</p>)}
      </div>
    </>);
}
