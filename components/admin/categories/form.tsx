"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ActionState } from "@/lib/utils";
import { CheckboxField, Field, inputClass, slugify } from "../forms/shared";
import { submitAction, useActionSuccess } from "../forms/form-helpers";

const initialState: ActionState = { status: "idle" };

export interface CategoryFormValues {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  parentId: string | null;
}

interface CategoryFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  category?: CategoryFormValues;
  parentOptions: { id: string; name: string }[];
  hasChildren?: boolean;
  onSuccess?: () => void;
}

export function CategoryForm({
  action,
  category,
  parentOptions,
  hasChildren = false,
  onSuccess,
}: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));

  const errors = state.fieldErrors ?? {};

  useActionSuccess(state, onSuccess);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form
      onSubmit={(event) =>
        submitAction(event, formAction, (formData) =>
          formData.set("slug", slugify(slug)),
        )
      }
      className="grid gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input
            required
            name="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="Diagnostic & Monitoring"
          />
        </Field>

        <Field label="Slug" error={errors.slug}>
          <input
            required
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase());
            }}
            onBlur={() => setSlug((s) => slugify(s))}
            className={inputClass}
            placeholder="diagnostic-monitoring"
          />
        </Field>

        <Field
          label="Parent category"
          error={errors.parentId}
          className="sm:col-span-2"
        >
          <select
            name="parentId"
            defaultValue={category?.parentId ?? ""}
            disabled={hasChildren}
            className={inputClass}
          >
            <option value="">— Top-level category —</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {hasChildren && (
            <p className="mt-1 text-[10px] text-ink/50">
              This category already has subcategories, so it can't be nested
              under another category.
            </p>
          )}
        </Field>

        <Field
          label="Subtitle"
          error={errors.subtitle}
          className="sm:col-span-2"
        >
          <input
            name="subtitle"
            defaultValue={category?.subtitle ?? ""}
            className={inputClass}
            placeholder="Optional short description"
          />
        </Field>

        <Field label="Icon" error={errors.icon}>
          <input
            name="icon"
            defaultValue={category?.icon ?? ""}
            className={inputClass}
            placeholder="Icon name or URL"
          />
        </Field>

        <Field label="Display order" error={errors.order}>
          <input
            type="number"
            name="order"
            defaultValue={category?.order ?? 0}
            className={inputClass}
          />
        </Field>

        <CheckboxField
          label="Active"
          name="active"
          defaultChecked={category?.active ?? true}
        />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-xs text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-paper transition hover:bg-ink-soft disabled:opacity-60"
        >
          {isPending
            ? "Saving…"
            : category
              ? "Save changes"
              : "Create category"}
          <ArrowUpRight size={15} />
        </button>
      </div>
    </form>
  );
}
