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

import { useDppList } from "@/queries/dpp"

function getDifficultyVariant(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "secondary"
    case "medium":
      return "default"
    case "hard":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function DppPage() {
  const { data: dpps = [], isLoading } = useDppList()

  return (
    <>
      <Helmet>
        <title>Daily Practice Papers — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Daily Practice Papers</h2>
            <p className="text-sm text-muted-foreground">
              {dpps.length} DPPs
            </p>
          </div>

          <Button size="sm" asChild>
            <Link to="/dpp/new">
              <IconPlus className="size-4" />
              New DPP
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading DPPs...</p>
        ) : dpps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No daily practice papers are available yet.
          </p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {dpps.map((paper) => (
              <Card key={paper.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {paper.title}
                      </CardTitle>
                    </div>
                    <Badge variant={getDifficultyVariant(paper.difficulty)}>
                      {paper.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paper.description && (
                    <p className="text-sm text-muted-foreground">
                      {paper.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dpp/${paper.id}/edit`}>
                        <IconPencil className="size-3.5" />
                        Edit
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Questions</p>
                      <p className="font-medium">{paper.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{paper.duration} min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">
                        {paper.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    {paper.publishedAt && (
                      <div>
                        <p className="text-muted-foreground">Published</p>
                        <p className="font-medium">
                          {new Date(paper.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>
                      Updated {new Date(paper.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
