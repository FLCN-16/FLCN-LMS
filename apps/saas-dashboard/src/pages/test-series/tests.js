import { IconArrowLeft, IconPencil, IconPlus, IconSend, } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flcn-lms/ui/components/table";
import { usePublishTest, useTestSeriesDetail, useTestsList, } from "@/queries/test-series";
export default function TestsPage() {
    const { seriesId } = useParams();
    const publishMutation = usePublishTest();
    const { data: series } = useTestSeriesDetail({
        variables: { id: seriesId },
        enabled: !!seriesId,
    });
    const { data: tests = [], isLoading } = useTestsList({
        variables: { seriesId: seriesId },
        enabled: !!seriesId,
    });
    return (<>
      <Helmet>
        <title>{series?.title ?? "Tests"} — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/test-series">
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {series?.title ?? "Tests"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tests.length} tests
            </p>
          </div>
          <Button size="sm" asChild>
            <Link to={`/test-series/${seriesId}/tests/new`}>
              <IconPlus className="size-4"/>
              Add Test
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (<TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>) : tests.length === 0 ? (<TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No tests yet.{" "}
                    <Link to={`/test-series/${seriesId}/tests/new`} className="underline underline-offset-4">
                      Add the first test.
                    </Link>
                  </TableCell>
                </TableRow>) : (tests.map((t) => (<TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">
                      {t.order}
                    </TableCell>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.testType}</Badge>
                    </TableCell>
                    <TableCell>{t.durationMins} min</TableCell>
                    <TableCell>{t.totalMarks}</TableCell>
                    <TableCell>{t.totalQuestions}</TableCell>
                    <TableCell>
                      <Badge variant={t.isPublished ? "default" : "secondary"}>
                        {t.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="size-7" asChild>
                          <Link to={`/test-series/${seriesId}/tests/${t.id}/edit`}>
                            <IconPencil className="size-4"/>
                          </Link>
                        </Button>
                        {!t.isPublished && (<Button size="icon" variant="ghost" className="size-7" title="Publish" onClick={() => {
                    if (!seriesId) {
                        return;
                    }
                    publishMutation.mutate({
                        seriesId,
                        testId: t.id,
                    });
                }}>
                            <IconSend className="size-4"/>
                          </Button>)}
                      </div>
                    </TableCell>
                  </TableRow>)))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>);
}
