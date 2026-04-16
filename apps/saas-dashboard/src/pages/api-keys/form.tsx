import { Helmet } from "react-helmet-async"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { useState } from "react"

import { Button } from "@flcn-lms/ui/components/button"
import { Input } from "@flcn-lms/ui/components/input"
import { Label } from "@flcn-lms/ui/components/label"
import { Checkbox } from "@flcn-lms/ui/components/checkbox"
import {
  useCreateApiKey,
  useUpdateApiKey,
} from "@/queries/api-keys"

interface ApiKeyFormData {
  name: string
  scopes: string[]
}

function ApiKeyFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const createMutation = useCreateApiKey()
  const updateMutation = useUpdateApiKey()

  const { control, handleSubmit } = useForm<ApiKeyFormData>({
    values: {
      name: "",
      scopes: ["read", "write"],
    },
  })

  const onSubmit = async (data: ApiKeyFormData) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({
          id,
          data: { name: data.name, scopes: data.scopes },
        })
        navigate("/api-keys")
      } else {
        const result = await createMutation.mutateAsync({
          name: data.name,
          scopes: data.scopes,
        })
        setCreatedKey(result.secret || "")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const copyToClipboard = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (createdKey) {
    return (
      <div className="space-y-6 px-4 py-2 md:px-6 max-w-2xl">
        <Helmet>
          <title>API Key Created — FLCN SaaS Admin</title>
        </Helmet>

        <div className="flex items-center gap-4">
          <Link
            to="/api-keys"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Key Created</h1>
            <p className="text-sm text-muted-foreground">
              Save this key now. You won't be able to see it again.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="space-y-2">
            <Label>Your API Key</Label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-md border border-border bg-muted p-3 font-mono text-sm break-all">
                {createdKey}
              </code>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Keep this key secret and don't share it with anyone.
            </p>
          </div>

          <Button asChild className="w-full">
            <Link to="/api-keys">Done</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-2 md:px-6 max-w-2xl">
      <Helmet>
        <title>{isEdit ? "Edit" : "Create"} API Key — FLCN SaaS Admin</title>
      </Helmet>

      <div className="flex items-center gap-4">
        <Link
          to="/api-keys"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit API Key" : "Generate API Key"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? "Update key details" : "Create a new API key for system access"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border border-border p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Key Name</Label>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="e.g., Production API"
              />
            )}
          />
        </div>

        <div className="space-y-3">
          <Label>Scopes</Label>
          <Controller
            control={control}
            name="scopes"
            render={({ field }) => (
              <div className="space-y-2">
                {["read", "write", "delete", "admin"].map((scope) => (
                  <div key={scope} className="flex items-center gap-2">
                    <Checkbox
                      id={`scope-${scope}`}
                      checked={field.value.includes(scope)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, scope])
                        } else {
                          field.onChange(
                            field.value.filter((s) => s !== scope)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`scope-${scope}`} className="capitalize">
                      {scope}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" asChild>
            <Link to="/api-keys">Cancel</Link>
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {isEdit ? "Update Key" : "Generate Key"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ApiKeyFormPage
