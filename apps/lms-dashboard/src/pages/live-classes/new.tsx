import { IconArrowLeft } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"

import { useCreateLiveSession } from "@/queries/live-sessions"

import { LiveSessionForm } from "./live-session-form"

export default function NewLiveSessionPage() {
  const navigate = useNavigate()
  const createMutation = useCreateLiveSession()

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/live-classes")
      },
    })
  }

  return (
    <>
      <Helmet>
        <title>New Live Session — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/live-classes">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Live Session</h2>
            <p className="text-sm text-muted-foreground">
              Schedule a new live class session
            </p>
          </div>
        </div>

        {createMutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to create session. Please try again.
          </p>
        )}

        <LiveSessionForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Create Session"
        />
      </div>
    </>
  )
}
