import { useState } from "react"

import { Button } from "@flcn-lms/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@flcn-lms/ui/components/field"
import { Input } from "@flcn-lms/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@flcn-lms/ui/components/native-select"
import { Switch } from "@flcn-lms/ui/components/switch"
import { Textarea } from "@flcn-lms/ui/components/textarea"

interface CouponFormProps {
  defaultValues?: {
    code?: string
    description?: string
    discountType?: "percentage" | "fixed"
    discountValue?: number
    maxDiscount?: number
    usageLimit?: number
    minPurchaseAmount?: number
    validFrom?: string
    validUntil?: string
    active?: boolean
    courseIds?: string[]
  }
  onSubmit: (data: any) => void
  isLoading: boolean
  submitLabel?: string
}

export function CouponForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Coupon",
}: CouponFormProps) {
  const [code, setCode] = useState(defaultValues?.code ?? "")
  const [description, setDescription] = useState(defaultValues?.description ?? "")
  const [discountType, setDiscountType] = useState(
    defaultValues?.discountType ?? "percentage"
  )
  const [discountValue, setDiscountValue] = useState(
    defaultValues?.discountValue ? String(defaultValues.discountValue) : "10"
  )
  const [maxDiscount, setMaxDiscount] = useState(
    defaultValues?.maxDiscount ? String(defaultValues.maxDiscount) : ""
  )
  const [usageLimit, setUsageLimit] = useState(
    defaultValues?.usageLimit ? String(defaultValues.usageLimit) : ""
  )
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(
    defaultValues?.minPurchaseAmount ? String(defaultValues.minPurchaseAmount) : ""
  )
  const [validFrom, setValidFrom] = useState(defaultValues?.validFrom ?? "")
  const [validUntil, setValidUntil] = useState(defaultValues?.validUntil ?? "")
  const [active, setActive] = useState(defaultValues?.active ?? false)

  const isFormValid = Boolean(code.trim() && discountValue && validFrom && validUntil)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    onSubmit({
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : undefined,
      validFrom,
      validUntil,
      active,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
          <CardDescription>
            Create and manage discount coupons for your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="code">Coupon Code</FieldLabel>
              <Input
                id="code"
                name="code"
                placeholder="e.g., SAVE10, WELCOME20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
              <FieldDescription>
                Unique coupon code (will be converted to uppercase)
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this coupon offer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <FieldDescription>
                Optional description of the coupon
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="discountType">Discount Type</FieldLabel>
                <NativeSelect
                  id="discountType"
                  name="discountType"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                >
                  <NativeSelectOption value="percentage">Percentage (%)</NativeSelectOption>
                  <NativeSelectOption value="fixed">Fixed Amount (₹)</NativeSelectOption>
                </NativeSelect>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="discountValue">Discount Value</FieldLabel>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                />
                <FieldDescription>
                  {discountType === "percentage" ? "Percentage (0-100)" : "Amount in rupees"}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="maxDiscount">Max Discount (₹)</FieldLabel>
                <Input
                  id="maxDiscount"
                  name="maxDiscount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                />
                <FieldDescription>
                  Optional maximum discount cap
                </FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="usageLimit">Usage Limit</FieldLabel>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min="0"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                />
                <FieldDescription>
                  Optional limit on how many times this coupon can be used
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="minPurchaseAmount">Min Purchase Amount (₹)</FieldLabel>
              <Input
                id="minPurchaseAmount"
                name="minPurchaseAmount"
                type="number"
                min="0"
                step="0.01"
                value={minPurchaseAmount}
                onChange={(e) => setMinPurchaseAmount(e.target.value)}
              />
              <FieldDescription>
                Optional minimum purchase amount to apply this coupon
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="validFrom">Valid From</FieldLabel>
                <Input
                  id="validFrom"
                  name="validFrom"
                  type="datetime-local"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  required
                />
                <FieldDescription>
                  Start date for coupon validity
                </FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="validUntil">Valid Until</FieldLabel>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="datetime-local"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                />
                <FieldDescription>
                  End date for coupon validity
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>

          <FieldGroup>
            <Field className="flex items-center justify-between">
              <div>
                <FieldLabel htmlFor="active">Active</FieldLabel>
                <FieldDescription>
                  Make this coupon available for use
                </FieldDescription>
              </div>
              <Switch
                id="active"
                name="active"
                checked={active}
                onCheckedChange={setActive}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid || isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
