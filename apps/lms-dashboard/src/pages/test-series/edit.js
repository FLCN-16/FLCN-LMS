import { IconArrowLeft } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@flcn-lms/ui/components/button";
import { Skeleton } from "@flcn-lms/ui/components/skeleton";
import { useTestSeriesDetail, useUpdateTestSeries } from "@/queries/test-series";
import { SeriesForm } from "./series-form";
export default function EditTestSeriesPage() {
    const { seriesId } = useParams();
    const navigate = useNavigate();
    const { data: series, isLoading } = useTestSeriesDetail({
        variables: { id: seriesId },
        enabled: !!seriesId,
    });
    const updateMutation = useUpdateTestSeries();
    return (<>
      <Helmet>
        <title>Edit Test Series — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/test-series/${seriesId}`}>
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>

          <div>
            <h2 className="text-xl font-semibold">Edit Test Series</h2>
            <p className="text-sm text-muted-foreground">{series?.title}</p>
          </div>
        </div>

        {isLoading ? (<div className="flex max-w-xl flex-col gap-4">
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-9 w-full"/>
            <Skeleton className="h-20 w-full"/>
          </div>) : series ? (<SeriesForm defaultValues={series} onSubmit={(data) => {
                if (!seriesId)
                    return;
                updateMutation.mutate({
                    id: seriesId,
                    data,
                }, {
                    onSuccess: () => {
                        navigate(`/test-series/${seriesId}`);
                    },
                });
            }} isLoading={updateMutation.isPending} submitLabel="Save Changes"/>) : (<p className="text-sm text-muted-foreground">Series not found.</p>)}
      </div>
    </>);
}
