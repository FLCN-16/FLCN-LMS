import { IconPencil, IconPlus } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

import { useLiveSessionsList } from "@/queries/live-sessions"

function getStatusVariant(status: string) {
  switch (status) {
    case "scheduled":
      return "secondary"
    case "live":
      return "default"
    case "completed":
      return "outline"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function LiveClassesPage() {
  const { data: sessions = [], isLoading } = useLiveSessionsList()

  return (
    <>
      <Helmet>
        <title>Live Classes — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Live Classes</h2>
            <p className="text-sm text-muted-foreground">
              {sessions.length} live sessions
            </p>
          </div>

          <Button size="sm" asChild>
            <Link to="/live-classes/new">
              <IconPlus className="size-4" />
              New Session
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No live sessions are available yet.
          </p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {session.title}
                      </CardTitle>
                    </div>
                    <Badge variant={getStatusVariant(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/live-classes/${session.id}/edit`}>
                        <IconPencil className="size-3.5" />
                        Edit
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Scheduled</p>
                      <p className="font-medium">
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{session.maxParticipants ?? "—"}</p>
                    </div>
                  </div>

                  {session.recordingUrl && (
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <a
                        href={session.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Recording
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
