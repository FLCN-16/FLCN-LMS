import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@flcn-lms/ui/lib/utils";
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
});
export function Heading({ variant = "h1", as, className, children, ...props }) {
    const Tag = (as ?? variant);
    return (<Tag className={cn(headingVariants({ variant }), className)} {...props}>
      {children}
    </Tag>);
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
});
const textTagMap = {
    p: "p",
    lead: "p",
    large: "div",
    small: "small",
    muted: "p",
    blockquote: "blockquote",
    code: "code",
};
export function Text({ variant = "p", as, className, children, ...props }) {
    const Tag = as ?? textTagMap[variant];
    return (<Tag className={cn(textVariants({ variant }), className)} {...props}>
      {children}
    </Tag>);
}
