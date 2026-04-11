import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const cardVariants = cva(
  "rounded-[var(--ds-radius-xl)] bg-[var(--ds-color-neutral-0)]",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      radius: {
        md: "rounded-[var(--ds-radius-md)]",
        lg: "rounded-[var(--ds-radius-lg)]",
        xl: "rounded-[var(--ds-radius-xl)]",
      },
      bordered: {
        true: "border border-[var(--ds-border-subtle)]",
        false: "border border-transparent",
      },
      elevated: {
        true: "shadow-[var(--ds-shadow-sm)]",
        false: "",
      },
      interactive: {
        true: "transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--ds-shadow-md)]",
        false: "",
      },
    },
    defaultVariants: {
      padding: "md",
      radius: "xl",
      bordered: true,
      elevated: false,
      interactive: false,
    },
  }
);

type CardProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, padding, radius, bordered, elevated, interactive, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ padding, radius, bordered, elevated, interactive }),
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

function CardHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function CardTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-[-0.03em] text-[var(--ds-color-primary-900)]",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("text-sm leading-6 text-[var(--ds-color-neutral-600)]", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mt-5", className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mt-6 flex items-center gap-3", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export type { CardProps };
