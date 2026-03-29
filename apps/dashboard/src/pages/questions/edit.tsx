import { Helmet } from "react-helmet-async"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@flcn-lms/ui/components/button"
import { Skeleton } from "@flcn-lms/ui/components/skeleton"

import { questionsApi, type CreateQuestionPayload } from "../../lib/api/questions"
import { QuestionForm } from "./question-form"

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: question, isLoading } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => questionsApi.get(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (data: CreateQuestionPayload) => questionsApi.update(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["questions"] })
      navigate("/panel/questions")
    },
  })

  return (
    <>
      <Helmet>
        <title>Edit Question — FLCN Dashboard</title>
      </Helmet>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/panel/questions">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Question</h2>
            <p className="text-sm text-muted-foreground">Update question details</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 max-w-2xl">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : question ? (
          <QuestionForm
            defaultValues={question}
            onSubmit={(data) => mutation.mutate(data)}
            isLoading={mutation.isPending}
            submitLabel="Save Changes"
          />
        ) : (
          <p className="text-sm text-muted-foreground">Question not found.</p>
        )}
      </div>
    </>
  )
}
