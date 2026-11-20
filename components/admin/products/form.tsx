"use client";

import { useActionState, useState, startTransition } from "react";
import { ArrowUpRight, Plus, Trash2 } from "lucide-react";
import type { Product, ProductSpec } from "@/generated/prisma/client";
import type { ActionState } from "@/lib/utils";
import { ImageUploader } from "../upload/image-uploader";
import { GalleryUploader } from "../upload/gallery-uploader";
import { CheckboxField, Field, inputClass, slugify } from "../forms/shared";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_CONDITIONS,
} from "@/lib/product-condition";
import { RichTextEditor } from "../forms/rich-text-editor";

const initialState: ActionState = { status: "idle" };

type RelationOption = { id: string; name: string };

type ProductWithRelations = Product & {
  specs?: ProductSpec[];
  collections?: { id: string }[];
};

interface ProductFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  product?: ProductWithRelations;
  categories: RelationOption[];
  collections: RelationOption[];
}

type SpecRow = { id: string; label: string; value: string; order: number };

function toSpecRows(specs?: ProductSpec[]): SpecRow[] {
  if (!specs || specs.length === 0) {
    return [{ id: crypto.randomUUID(), label: "", value: "", order: 0 }];
  }
  return specs.map((spec) => ({
    id: spec.id,
    label: spec.label,
    value: spec.value,
    order: spec.order,
  }));
}

export function ProductForm({
  action,
  product,
  categories,
  collections,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState(product?.name ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? "",
  );
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [image, setImage] = useState(product?.image ?? "");
  const [gallery, setGallery] = useState<string[]>(product?.gallery ?? []);
  const [specs, setSpecs] = useState<SpecRow[]>(toSpecRows(product?.specs));
  const [collectionIds, setCollectionIds] = useState<string[]>(
    product?.collections?.map((c) => c.id) ?? [],
  );

  const errors = state.fieldErrors ?? {};

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function updateSpec(id: string, patch: Partial<SpecRow>) {
    setSpecs((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addSpec() {
    setSpecs((rows) => [
      ...rows,
      { id: crypto.randomUUID(), label: "", value: "", order: rows.length },
    ]);
  }

  function removeSpec(id: string) {
    setSpecs((rows) => rows.filter((r) => r.id !== id));
  }

  function toggleCollection(id: string) {
    setCollectionIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  const specsPayload = JSON.stringify(
    specs
      .filter((row) => row.label.trim() && row.value.trim())
      .map((row, index) => ({
        label: row.label.trim(),
        value: row.value.trim(),
        order: index,
      })),
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("slug", slugify(slug));
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 border border-ink/20 bg-white/40 p-6 sm:grid-cols-2">
        <Field label="Name" error={errors.name} className="sm:col-span-2">
          <input
            required
            name="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="On Call Meter"
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
            placeholder="on-call-meter"
          />
        </Field>

        <Field label="Price (KES)" error={errors.price}>
          <input
            type="number"
            step="1"
            min="0"
            name="price"
            defaultValue={product?.price != null ? String(product.price) : ""}
            className={inputClass}
            placeholder="Leave empty for quote-only products"
          />
        </Field>

        <Field
          label="Short Description"
          error={errors.shortDescription}
          className="sm:col-span-2"
        >
          <input
            required
            name="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={inputClass}
            placeholder="A brief description of the product"
          />
        </Field>

        <Field label="Compare-at price (KES)" error={errors.compareAtPrice}>
          <input
            type="number"
            step="1"
            min="0"
            name="compareAtPrice"
            defaultValue={
              product?.compareAtPrice != null
                ? String(product.compareAtPrice)
                : ""
            }
            className={inputClass}
            placeholder="Optional: original price before discount"
          />
        </Field>

        <Field
          label="Description"
          error={errors.description}
          className="sm:col-span-2"
        >
          <RichTextEditor
            name="description"
            defaultValue={product?.description ?? ""}
            placeholder="What makes this piece worth buying."
            folder="/products/description"
            resource="product"
          />
        </Field>

        <Field label="Category" error={errors.categoryId}>
          <select
            required
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Condition" error={errors.condition}>
          <select
            name="condition"
            defaultValue={product?.condition ?? "NEW"}
            className={inputClass}
          >
            {PRODUCT_CONDITIONS.map((value) => (
              <option key={value} value={value}>
                {PRODUCT_CONDITION_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Collections"
          error={errors.collectionIds}
          className="sm:col-span-2"
        >
          {collections.length === 0 ? (
            <p className="text-xs text-ink/60">No collections yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {collections.map((c) => {
                const active = collectionIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCollection(c.id)}
                    aria-pressed={active}
                    className={`border px-3 py-1.5 text-[10px] uppercase tracking-widest transition ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/20 text-ink/60 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
          {collectionIds.map((id) => (
            <input key={id} type="hidden" name="collectionIds" value={id} />
          ))}
        </Field>

        <div className="flex items-end gap-6 sm:col-span-2">
          <CheckboxField
            label="Featured"
            name="featured"
            defaultChecked={product?.featured ?? false}
          />
          <CheckboxField
            label="In stock"
            name="inStock"
            defaultChecked={product?.inStock ?? true}
          />
        </div>
      </div>

      <div className="grid gap-5 border border-ink/20 bg-white/40 p-6 sm:grid-cols-2">
        <Field label="Main image" error={errors.image}>
          <ImageUploader
            value={image}
            onChange={setImage}
            folder="/products/images"
            label="product image"
            resource="product"
          />
          <input type="hidden" name="image" value={image} />
        </Field>

        <Field label="Gallery" error={errors.gallery}>
          <GalleryUploader
            value={gallery}
            onChange={setGallery}
            folder="/products/gallery"
            resource="product"
          />
        </Field>
      </div>

      <div className="border border-ink/20 bg-white/40 p-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest">Specs</p>
          <button
            type="button"
            onClick={addSpec}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink"
          >
            <Plus size={13} /> Add row
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {specs.map((row) => (
            <div key={row.id} className="flex items-center gap-3">
              <input
                value={row.label}
                onChange={(e) => updateSpec(row.id, { label: e.target.value })}
                className={inputClass}
                placeholder="Material"
              />
              <input
                value={row.value}
                onChange={(e) => updateSpec(row.id, { value: e.target.value })}
                className={inputClass}
                placeholder="Solid oak"
              />
              <button
                type="button"
                onClick={() => removeSpec(row.id)}
                aria-label="Remove spec"
                className="p-2 text-ink/40 hover:text-red-700"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <input type="hidden" name="specs" value={specsPayload} />
        {errors.specs && (
          <p className="mt-1 text-[11px] text-red-700">{errors.specs}</p>
        )}
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
          {isPending ? "Saving…" : product ? "Save changes" : "Create product"}
          <ArrowUpRight size={15} />
        </button>
      </div>
    </form>
  );
}
