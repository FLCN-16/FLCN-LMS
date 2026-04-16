import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import { Loader } from "@/components/loader"

import {
  useLiveSessionDetail,
  useUpdateLiveSession,
} from "@/queries/live-sessions"
import { LiveSessionForm } from "./live-session-form"

export default function EditLiveSessionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: session, isLoading } = useLiveSessionDetail({ id: id! }, { enabled: !!id })
  const updateMutation = useUpdateLiveSession()

  const handleSubmit = (data: any) => {
    if (!id) return
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate("/live-classes")
        },
      }
    )
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Helmet>
        <title>Edit Live Session — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/live-classes">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Live Session</h2>
            <p className="text-sm text-muted-foreground">
              Update the details of your live class session
            </p>
          </div>
        </div>

        {updateMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to update session. Please try again.
          </p>
        )}

        <LiveSessionForm
          defaultValues={session}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Update session"
        />
      </div>
    </>
  )
}
