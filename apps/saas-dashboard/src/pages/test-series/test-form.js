import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@flcn-lms/ui/components/field";
import { Input } from "@flcn-lms/ui/components/input";
import { NativeSelect, NativeSelectOption, } from "@flcn-lms/ui/components/native-select";
import { Separator } from "@flcn-lms/ui/components/separator";
import { DateTimePicker } from "../../components/date-time-picker";
import { RichEditor } from "../../components/rich-editor";
const TEST_TYPE_LABELS = {
    FULL_LENGTH: "Full Length",
    SECTIONAL: "Sectional",
    CHAPTER_WISE: "Chapter Wise",
    DPP: "Daily Practice (DPP)",
    PREVIOUS_YEAR: "Previous Year",
};
export function TestForm({ defaultValues, onSubmit, isLoading, nextOrder = 1, submitLabel = "Save", }) {
    function handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit({
            slug: fd.get("slug"),
            title: fd.get("title"),
            testType: fd.get("testType"),
            durationMins: Number(fd.get("durationMins")),
            totalMarks: Number(fd.get("totalMarks")),
            totalQuestions: Number(fd.get("totalQuestions")),
            order: Number(fd.get("order")),
            instructions: fd.get("instructions") || undefined,
            scheduledAt: fd.get("scheduledAt") || undefined,
            endsAt: fd.get("endsAt") || undefined,
            attemptLimit: Number(fd.get("attemptLimit")) || 1,
            showResultAfter: fd.get("showResultAfter") || undefined,
        });
    }
    return (<form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Identity */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Test Identity</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input name="title" placeholder="Full Mock Test #1" required defaultValue={defaultValues?.title}/>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input name="slug" placeholder="full-mock-1" required defaultValue={defaultValues?.slug}/>
                <FieldDescription>Unique within this series</FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Order</FieldLabel>
                <Input name="order" type="number" min="1" defaultValue={defaultValues?.order ?? nextOrder}/>
                <FieldDescription>Position in the series list</FieldDescription>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Test Type</FieldLabel>
                <NativeSelect name="testType" defaultValue={defaultValues?.testType ?? "FULL_LENGTH"} className="w-full">
                  {Object.entries(TEST_TYPE_LABELS).map(([val, label]) => (<NativeSelectOption key={val} value={val}>
                      {label}
                    </NativeSelectOption>))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel>Show Result After</FieldLabel>
                <NativeSelect name="showResultAfter" defaultValue={defaultValues?.showResultAfter ?? "INSTANT"} className="w-full">
                  <NativeSelectOption value="INSTANT">
                    Instant
                  </NativeSelectOption>
                  <NativeSelectOption value="AFTER_END_DATE">
                    After End Date
                  </NativeSelectOption>
                  <NativeSelectOption value="MANUAL">Manual</NativeSelectOption>
                </NativeSelect>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Structure */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Structure & Scoring</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Duration</FieldLabel>
                <div className="relative">
                  <Input name="durationMins" type="number" min="1" required defaultValue={defaultValues?.durationMins ?? 180} className="pr-10"/>
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
              </Field>

              <Field>
                <FieldLabel>Total Marks</FieldLabel>
                <Input name="totalMarks" type="number" min="1" required defaultValue={defaultValues?.totalMarks ?? 300}/>
              </Field>

              <Field>
                <FieldLabel>Questions</FieldLabel>
                <Input name="totalQuestions" type="number" min="1" required defaultValue={defaultValues?.totalQuestions ?? 75}/>
              </Field>
            </div>

            <Separator />

            <Field>
              <FieldLabel>Attempt Limit</FieldLabel>
              <Input name="attemptLimit" type="number" min="0" defaultValue={defaultValues?.attemptLimit ?? 1} className="max-w-xs"/>
              <FieldDescription>
                Set to 0 for unlimited attempts
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Scheduling</CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              optional
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <DateTimePicker name="scheduledAt" label="Scheduled At" optional defaultValue={defaultValues?.scheduledAt} description="Leave empty to make available immediately"/>
              <DateTimePicker name="endsAt" label="Ends At" optional defaultValue={defaultValues?.endsAt} description="Auto-submits attempts after this time"/>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Instructions</CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              optional
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Field>
            <RichEditor name="instructions" placeholder="Instructions shown to students on the test start screen…" defaultValue={defaultValues?.instructions} minHeight={180} mode="basic"/>
            <FieldDescription>
              Supports rich text — bold, lists, links
            </FieldDescription>
          </Field>
        </CardContent>
      </Card>

      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>);
}
