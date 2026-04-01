import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@flcn-lms/ui/lib/utils"

// ─── Heading ──────────────────────────────────────────────────────────────────

const headingVariants = cva("scroll-m-20 font-semibold tracking-tight", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold",
      h2: "text-3xl first:mt-0",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg",
      h6: "text-base",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
})

type HeadingVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

interface HeadingProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  variant?: HeadingVariant
  as?: HeadingVariant
}

export function Heading({
  variant = "h1",
  as,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = (as ?? variant) as React.ElementType
  return (
    <Tag className={cn(headingVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  )
}

// ─── Text ─────────────────────────────────────────────────────────────────────

const textVariants = cva("", {
  variants: {
    variant: {
      p: "leading-normal",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm leading-none font-medium",
      muted: "text-sm text-muted-foreground",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

const textTagMap = {
  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
  blockquote: "blockquote",
  code: "code",
} as const

type TextVariant = keyof typeof textTagMap

interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  variant?: TextVariant
  as?: React.ElementType
}

export function Text({
  variant = "p",
  as,
  className,
  children,
  ...props
}: TextProps) {
  const Tag = as ?? textTagMap[variant]
  return (
    <Tag className={cn(textVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  )
}
