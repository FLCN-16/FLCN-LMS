import { IconChevronRight, IconPencil, IconPlus, IconSend, IconTrash, } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
import { usePublishTestSeries, useRemoveTestSeries, useTestSeriesList, } from "@/queries/test-series";
export default function TestSeriesPage() {
    const { data: series = [], isLoading } = useTestSeriesList();
    const publishMutation = usePublishTestSeries();
    const deleteMutation = useRemoveTestSeries();
    return (<>
      <Helmet>
        <title>Test Series — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Test Series</h2>
            <p className="text-sm text-muted-foreground">
              {series.length} series
            </p>
          </div>
          <Button size="sm" asChild>
            <Link to="/test-series/new">
              <IconPlus className="size-4"/>
              New Series
            </Link>
          </Button>
        </div>

        {isLoading ? (<p className="text-sm text-muted-foreground">Loading...</p>) : series.length === 0 ? (<p className="text-sm text-muted-foreground">
            No test series yet.{" "}
            <Link to="/test-series/new" className="underline underline-offset-4">
              Create one.
            </Link>
          </p>) : (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {series.map((s) => (<Card key={s.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {s.title}
                    </CardTitle>
                    <Badge variant={s.isPublished ? "default" : "secondary"} className="shrink-0">
                      {s.isPublished ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.examType} · {s.totalTests} tests
                    {s.isPaid && s.price ? ` · ₹${s.price}` : " · Free"}
                  </p>
                </CardHeader>
                <CardContent>
                  {s.description && (<p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {s.description}
                    </p>)}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/test-series/${s.id}`}>
                        Tests <IconChevronRight className="size-3"/>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/test-series/${s.id}/edit`}>
                        <IconPencil className="size-3"/>
                        Edit
                      </Link>
                    </Button>
                    {!s.isPublished && (<Button size="sm" variant="ghost" onClick={() => publishMutation.mutate({ id: s.id })} disabled={publishMutation.isPending}>
                        <IconSend className="size-3"/>
                        Publish
                      </Button>)}
                    <Button size="icon" variant="ghost" className="ml-auto size-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate({ id: s.id })} disabled={deleteMutation.isPending}>
                      <IconTrash className="size-4"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>))}
          </div>)}
      </div>
    </>);
}
