export const inputClass =
  "mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none placeholder:text-ink/40";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

import { useId } from "react";

export function Field({
  label,
  error,
  className,
  children,
  group = false,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  group?: boolean;
}) {
  const labelId = useId();
  const classes = `text-[10px] uppercase tracking-widest ${className ?? ""}`;

  const errorEl = error && (
    <p className="mt-1 text-[11px] normal-case tracking-normal text-red-700">
      {error}
    </p>
  );

  if (group) {
    return (
      <div role="group" aria-labelledby={labelId} className={classes}>
        <span id={labelId}>{label}</span>
        {children}
        {errorEl}
      </div>
    );
  }

  return (
    <label className={classes}>
      {label}
      {children}
      {errorEl}
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 self-end pb-2 text-[10px] uppercase tracking-widest">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-3.5 w-3.5"
      />
      {label}
    </label>
  );
}
