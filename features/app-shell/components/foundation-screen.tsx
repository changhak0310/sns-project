import type { ReactNode } from "react";

type FoundationScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{
    label: string;
    value: string;
  }>;
  children?: ReactNode;
};

export function FoundationScreen({
  eyebrow,
  title,
  description,
  highlights,
  children,
}: FoundationScreenProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="rounded-[36px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr] lg:items-end">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-accent-500)]">
              {eyebrow}
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-[var(--color-neutral-950)] lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-neutral-600)] lg:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-4"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-neutral-500)]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-neutral-900)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
