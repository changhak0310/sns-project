import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const textareaVariants = cva(
  "min-h-[140px] w-full rounded-[var(--ds-radius-lg)] border bg-[var(--ds-ui-surface)] px-4 py-3 text-base text-[var(--ds-ui-text-primary)] transition-[border-color,box-shadow,background-color] duration-200 ease-out outline-none placeholder:text-[var(--ds-ui-text-muted)] focus:border-[var(--ds-ui-border-strong)] focus:shadow-[0_0_0_4px_var(--ds-ui-focus-ring)] disabled:opacity-60",
  {
    variants: {
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        both: "resize",
      },
      hasError: {
        true: "border-[var(--ds-color-error-500)] focus:border-[var(--ds-color-error-500)] focus:shadow-[0_0_0_4px_var(--ds-ui-error-focus-ring)]",
        false: "border-[var(--ds-ui-border-subtle)]",
      },
    },
    defaultVariants: {
      resize: "vertical",
      hasError: false,
    },
  }
);

type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> &
  VariantProps<typeof textareaVariants> & {
    error?: string;
    showCounter?: boolean;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      resize,
      error,
      showCounter = false,
      maxLength,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
          ? defaultValue.length
          : 0;

    return (
      <div className="flex flex-col gap-2">
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={Boolean(error)}
          className={cn(textareaVariants({ resize, hasError: Boolean(error) }), className)}
          {...props}
        />
        <div className="flex items-center justify-between gap-3">
          {error ? (
            <p className="text-sm leading-6 text-[var(--ds-color-error-500)]">{error}</p>
          ) : (
            <span />
          )}
          {showCounter && maxLength ? (
            <p className="text-xs font-medium text-[var(--ds-ui-text-muted)]">
              {currentLength} / {maxLength}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
