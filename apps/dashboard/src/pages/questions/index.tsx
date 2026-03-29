import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconCheck, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"

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

import { questionsApi, type Question } from "../../lib/api/questions"

const DIFFICULTY_VARIANT = {
  EASY: "default",
  MEDIUM: "secondary",
  HARD: "destructive",
} as const

export default function QuestionsPage() {
  const qc = useQueryClient()

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: () => questionsApi.list(),
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => questionsApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["questions"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["questions"] }),
  })

  return (
    <>
      <Helmet>
        <title>Question Bank — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Question Bank</h2>
            <p className="text-sm text-muted-foreground">{questions.length} questions</p>
          </div>
          <Button size="sm" asChild>
            <Link to="/panel/questions/new">
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
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No questions yet.{" "}
                    <Link to="/panel/questions/new" className="underline underline-offset-4">
                      Add your first question.
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q: Question) => (
                  <TableRow key={q.id}>
                    <TableCell className="max-w-xs truncate font-medium">{q.content}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{q.type}</Badge>
                    </TableCell>
                    <TableCell>{q.subject}</TableCell>
                    <TableCell>{q.topic}</TableCell>
                    <TableCell>
                      <Badge variant={DIFFICULTY_VARIANT[q.difficulty]}>{q.difficulty}</Badge>
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
                            onClick={() => approveMutation.mutate(q.id)}
                          >
                            <IconCheck className="size-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="size-7" asChild>
                          <Link to={`/panel/questions/${q.id}/edit`}>
                            <IconPencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive hover:text-destructive"
                          title="Delete"
                          onClick={() => deleteMutation.mutate(q.id)}
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
