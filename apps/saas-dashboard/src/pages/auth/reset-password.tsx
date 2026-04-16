import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import { cn } from "@flcn-lms/ui/lib/utils"

function ResetPasswordPage({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <Helmet>
        <title>Reset Password — FLCN Dashboard</title>
      </Helmet>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter a new password for your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <Input id="confirm-password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Reset password</Button>
          <FieldDescription className="text-center">
            <Link to="/auth/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordPage
