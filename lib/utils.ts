import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export const formatCurrency = (amount: number, currency = "KES") =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

export function toISOString(
  value: Date | string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key])
      fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export function linesToArray(value: FormDataEntryValue | null): string[] {
  return ((value as string) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function toPlainText(html: string, max = 160) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
