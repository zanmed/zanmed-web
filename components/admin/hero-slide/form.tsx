"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ActionState } from "@/lib/utils";
import { CheckboxField, Field, inputClass } from "../forms/shared";
import { ImageUploader } from "../upload/image-uploader";
import { submitAction, useActionSuccess } from "../forms/form-helpers";

const initialState: ActionState = { status: "idle" };

export interface HeroSlideFormValues {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  href: string;
  pillTop: string;
  pillBottom: string;
  order: number;
  active: boolean;
}

interface HeroSlideFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  slide?: HeroSlideFormValues;
  onSuccess?: () => void;
}

export function HeroSlideForm({
  action,
  slide,
  onSuccess,
}: HeroSlideFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [image, setImage] = useState(slide?.image ?? "");
  const errors = state.fieldErrors ?? {};

  useActionSuccess(state, onSuccess);

  return (
    <form
      onSubmit={(event) => submitAction(event, formAction)}
      className="grid gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Eyebrow" error={errors.eyebrow}>
          <input
            name="eyebrow"
            defaultValue={slide?.eyebrow ?? ""}
            className={inputClass}
            placeholder="Trusted. Genuine. Delivered."
            required
          />
        </Field>

        <Field label="Link (href)" error={errors.href}>
          <input
            name="href"
            defaultValue={slide?.href ?? ""}
            className={inputClass}
            placeholder="/products"
            required
          />
        </Field>

        <Field label="Title" error={errors.title}>
          <input
            name="title"
            defaultValue={slide?.title ?? ""}
            className={inputClass}
            placeholder="Medical Equipment"
            required
          />
        </Field>

        <Field label="Hero image" error={errors.image} group>
          <ImageUploader
            value={image}
            onChange={setImage}
            folder="/hero-slides"
            label="hero slide image"
            resource="heroSlide"
          />
          <input type="hidden" name="image" value={image} />
        </Field>

        <Field label="Accent" error={errors.accent}>
          <input
            name="accent"
            defaultValue={slide?.accent ?? ""}
            className={inputClass}
            placeholder="You Can Trust"
            required
          />
        </Field>

        <Field
          label="Description"
          error={errors.description}
          className="sm:col-span-2"
        >
          <textarea
            name="description"
            rows={2}
            defaultValue={slide?.description ?? ""}
            className={`${inputClass} resize-none`}
            placeholder="Genuine medical and laboratory equipment, delivered across Kenya."
            required
          />
        </Field>

        <Field label="Pill (top)" error={errors.pillTop}>
          <input
            name="pillTop"
            defaultValue={slide?.pillTop ?? ""}
            className={inputClass}
            placeholder="New"
            required
          />
        </Field>

        <Field label="Pill (bottom)" error={errors.pillBottom}>
          <input
            name="pillBottom"
            defaultValue={slide?.pillBottom ?? ""}
            className={inputClass}
            placeholder="Arrivals"
            required
          />
        </Field>

        <Field label="Display order" error={errors.order}>
          <input
            type="number"
            name="order"
            defaultValue={slide?.order ?? 0}
            className={inputClass}
          />
        </Field>

        <CheckboxField
          label="Active"
          name="active"
          defaultChecked={slide?.active ?? true}
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
          {isPending ? "Saving…" : slide ? "Save changes" : "Create slide"}
          <ArrowUpRight size={15} />
        </button>
      </div>
    </form>
  );
}
