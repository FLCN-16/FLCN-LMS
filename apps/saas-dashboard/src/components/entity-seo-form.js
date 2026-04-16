import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@flcn-lms/ui/components/field";
import { Input } from "@flcn-lms/ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@flcn-lms/ui/components/tabs";
import { Textarea } from "@flcn-lms/ui/components/textarea";
export function EntitySeoForm({ entityLabel, defaultValues, }) {
    const previewTitle = defaultValues?.seoTitle || `Optimized ${entityLabel} page title`;
    const previewDescription = defaultValues?.seoDescription ||
        `Describe the value of this ${entityLabel.toLowerCase()} for search results and social sharing.`;
    const previewKeywords = defaultValues?.seoKeywords?.join(", ") ?? "";
    return (<Card>
      <CardHeader className="border-b">
        <CardTitle>SEO</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="metadata" className="gap-4">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="metadata">
            <FieldGroup>
              <Field>
                <FieldLabel>SEO Title</FieldLabel>
                <Input name="seoTitle" placeholder={`${entityLabel} | FLCN LMS`} defaultValue={defaultValues?.seoTitle ?? ""}/>
                <FieldDescription>
                  Best kept under 60 characters for search results.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>SEO Description</FieldLabel>
                <Textarea name="seoDescription" rows={4} placeholder={`Search-friendly summary for this ${entityLabel.toLowerCase()} page.`} defaultValue={defaultValues?.seoDescription ?? ""}/>
                <FieldDescription>
                  Aim for a concise summary around 150-160 characters.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="keywords">
            <FieldGroup>
              <Field>
                <FieldLabel>SEO Keywords</FieldLabel>
                <Input name="seoKeywords" placeholder={`${entityLabel.toLowerCase()}, learning, online education`} defaultValue={previewKeywords}/>
                <FieldDescription>
                  Use comma-separated keywords for internal SEO organization.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="social">
            <FieldGroup>
              <Field>
                <FieldLabel>SEO Image URL</FieldLabel>
                <Input name="seoImageUrl" placeholder="https://example.com/social-preview.jpg" defaultValue={defaultValues?.seoImageUrl ?? ""}/>
                <FieldDescription>
                  Used for share cards and social previews when available.
                </FieldDescription>
              </Field>

              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="mb-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Preview
                </p>
                <p className="text-base font-semibold">{previewTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {previewDescription}
                </p>
              </div>
            </FieldGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>);
}
