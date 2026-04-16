import { IconArrowLeft } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@flcn-lms/ui/components/button";
import { useCreateTest, useTestSeriesDetail, useTestsList, } from "@/queries/test-series";
import { TestForm } from "./test-form";
export default function NewTestPage() {
    const { seriesId } = useParams();
    const navigate = useNavigate();
    const mutation = useCreateTest();
    const { data: series } = useTestSeriesDetail({
        variables: { id: seriesId },
        enabled: !!seriesId,
    });
    const { data: tests = [] } = useTestsList({
        variables: { seriesId: seriesId },
        enabled: !!seriesId,
    });
    const handleSubmit = (data) => {
        if (!seriesId) {
            return;
        }
        mutation.mutate({ seriesId, data }, {
            onSuccess: () => {
                navigate(`/test-series/${seriesId}`);
            },
        });
    };
    return (<>
      <Helmet>
        <title>New Test — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/test-series/${seriesId}`}>
              <IconArrowLeft className="size-4"/>
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Test</h2>
            <p className="text-sm text-muted-foreground">{series?.title}</p>
          </div>
        </div>

        {mutation.isError && (<p className="mb-4 text-sm text-destructive">
            Failed to create test. Please try again.
          </p>)}

        <TestForm onSubmit={handleSubmit} isLoading={mutation.isPending} nextOrder={tests.length + 1} submitLabel="Create Test"/>
      </div>
    </>);
}
