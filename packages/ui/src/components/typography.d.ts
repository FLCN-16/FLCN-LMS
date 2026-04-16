import { type VariantProps } from "class-variance-authority";
import * as React from "react";
declare const headingVariants: (props?: ({
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type HeadingVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
    variant?: HeadingVariant;
    as?: HeadingVariant;
}
export declare function Heading({ variant, as, className, children, ...props }: HeadingProps): React.JSX.Element;
declare const textVariants: (props?: ({
    variant?: "small" | "blockquote" | "code" | "p" | "lead" | "large" | "muted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const textTagMap: {
    readonly p: "p";
    readonly lead: "p";
    readonly large: "div";
    readonly small: "small";
    readonly muted: "p";
    readonly blockquote: "blockquote";
    readonly code: "code";
};
type TextVariant = keyof typeof textTagMap;
interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
    variant?: TextVariant;
    as?: React.ElementType;
}
export declare function Text({ variant, as, className, children, ...props }: TextProps): React.JSX.Element;
export {};
//# sourceMappingURL=typography.d.ts.map