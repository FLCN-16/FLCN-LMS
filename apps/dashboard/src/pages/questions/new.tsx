import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@flcn-lms/ui/components/button"

import { questionsApi, type CreateQuestionPayload } from "../../lib/api/questions"
import { QuestionForm } from "./question-form"

export default function NewQuestionPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateQuestionPayload) => questionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["questions"] })
      navigate("/panel/questions")
    },
  })

  return (
    <>
      <Helmet>
        <title>New Question — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/panel/questions">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">New Question</h2>
            <p className="text-sm text-muted-foreground">Add a question to the bank</p>
          </div>
        </div>

        {mutation.isError && (
          <p className="mb-4 text-sm text-destructive">
            Failed to create question. Please try again.
          </p>
        )}

        <QuestionForm
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          submitLabel="Create Question"
        />
      </div>
    </>
  )
}
