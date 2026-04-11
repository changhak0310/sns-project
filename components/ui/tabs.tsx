"use client";

import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const tabsListVariants = cva("inline-flex items-center gap-2", {
  variants: {
    variant: {
      underline:
        "w-full border-b border-[var(--ds-border-subtle)] pb-1 [&>*]:rounded-t-2xl",
      pill: "rounded-full bg-[var(--ds-color-neutral-100)] p-1",
      segmented:
        "rounded-[var(--ds-radius-full)] border border-[var(--ds-border-subtle)] p-1",
    },
    size: {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "underline",
    size: "md",
  },
});

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition-[background-color,color,border-color] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-accent-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-color-neutral-0)] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        underline:
          "border-b-2 border-transparent rounded-none px-1 pb-3 pt-2 text-[var(--ds-color-neutral-500)] data-[active=true]:border-[var(--ds-color-primary-900)] data-[active=true]:text-[var(--ds-color-primary-900)]",
        pill:
          "text-[var(--ds-color-neutral-600)] data-[active=true]:bg-[var(--ds-color-neutral-0)] data-[active=true]:text-[var(--ds-color-primary-900)] data-[active=true]:shadow-[var(--ds-shadow-sm)]",
        segmented:
          "text-[var(--ds-color-neutral-600)] data-[active=true]:bg-[var(--ds-color-primary-900)] data-[active=true]:text-[var(--ds-color-neutral-0)]",
      },
      size: {
        sm: "min-h-9 text-sm",
        md: "min-h-10 text-sm",
        lg: "min-h-11 text-base",
      },
    },
    defaultVariants: {
      variant: "underline",
      size: "md",
    },
  }
);

type TabsItem = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
};

type TabsProps = VariantProps<typeof tabsListVariants> & {
  items: TabsItem[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function Tabs({ items, value, onChange, variant, size, className }: TabsProps) {
  return (
    <div className={cn(tabsListVariants({ variant, size }), className)} role="tablist">
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-active={isActive}
            disabled={item.disabled}
            className={cn(tabsTriggerVariants({ variant, size }))}
            onClick={() => onChange?.(item.value)}
          >
            {item.icon ? <span aria-hidden>{item.icon}</span> : null}
            <span>{item.label}</span>
            {item.badge ? <span className="text-xs opacity-80">{item.badge}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export type { TabsItem, TabsProps };
