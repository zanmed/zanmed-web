"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ActionState } from "@/lib/utils";
import { ImageUploader } from "../upload/image-uploader";
import { Field, inputClass, slugify } from "../forms/shared";
import { submitAction, useActionSuccess } from "../forms/form-helpers";

const initialState: ActionState = { status: "idle" };

export interface CollectionFormValues {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  description: string | null;
}

interface CollectionFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  collection?: CollectionFormValues;
  onSuccess?: () => void;
}

export function CollectionForm({
  action,
  collection,
  onSuccess,
}: CollectionFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(collection));
  const [coverImage, setCoverImage] = useState(collection?.coverImage ?? "");

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
            placeholder="Clinic Setup Bundles"
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
            placeholder="clinic-setup-bundles"
          />
        </Field>

        <Field
          label="Cover image"
          error={errors.coverImage}
          className="sm:col-span-2"
          group
        >
          <ImageUploader
            value={coverImage}
            onChange={setCoverImage}
            folder="/collections/covers"
            label="cover image"
            resource="collection"
          />
          <input type="hidden" name="coverImage" value={coverImage} />
        </Field>

        <Field
          label="Description"
          error={errors.description}
          className="sm:col-span-2"
        >
          <textarea
            name="description"
            rows={3}
            defaultValue={collection?.description ?? ""}
            className={`${inputClass} resize-none`}
            placeholder="A short description shown on the collection page."
          />
        </Field>
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
            : collection
              ? "Save changes"
              : "Create collection"}
          <ArrowUpRight size={15} />
        </button>
      </div>
    </form>
  );
}
