import { IconCheck, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@flcn-lms/ui/components/table"

import {
  useApproveQuestion,
  useDeleteQuestion,
  useQuestionsList,
} from "@/queries/questions"

const DIFFICULTY_VARIANT = {
  EASY: "default",
  MEDIUM: "secondary",
  HARD: "destructive",
} as const

export default function QuestionsPage() {
  const { data: questions = [], isLoading } = useQuestionsList()
  const approveMutation = useApproveQuestion()
  const deleteMutation = useDeleteQuestion()

  return (
    <>
      <Helmet>
        <title>Question Bank — FLCN Dashboard</title>
      </Helmet>

      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Question Bank</h2>
            <p className="text-sm text-muted-foreground">
              {questions.length} questions
            </p>
          </div>

          <Button size="sm" asChild>
            <Link to="/questions/new">
              <IconPlus className="size-4" />
              Add Question
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No questions yet.{" "}
                    <Link
                      to="/questions/new"
                      className="underline underline-offset-4"
                    >
                      Add your first question.
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="max-w-xs truncate font-medium">
                      {q.content}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{q.type}</Badge>
                    </TableCell>
                    <TableCell>{q.subject}</TableCell>
                    <TableCell>{q.topic}</TableCell>
                    <TableCell>
                      <Badge variant={DIFFICULTY_VARIANT[q.difficulty]}>
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      +{q.positiveMarks} / -{q.negativeMarks}
                    </TableCell>
                    <TableCell>
                      <Badge variant={q.isApproved ? "default" : "secondary"}>
                        {q.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {!q.isApproved && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            title="Approve"
                            onClick={() => approveMutation.mutate({ id: q.id })}
                            disabled={approveMutation.isPending}
                          >
                            <IconCheck className="size-4" />
                          </Button>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          asChild
                        >
                          <Link to={`/questions/${q.id}/edit`}>
                            <IconPencil className="size-4" />
                          </Link>
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive hover:text-destructive"
                          title="Delete"
                          onClick={() => deleteMutation.mutate({ id: q.id })}
                          disabled={deleteMutation.isPending}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
