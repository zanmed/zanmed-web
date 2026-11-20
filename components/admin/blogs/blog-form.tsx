"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { Blog } from "@/generated/prisma/client";
import type { ActionState } from "@/lib/utils";
import { ImageUploader } from "../upload/image-uploader";
import { RichTextEditor } from "../forms/rich-text-editor";
import { Field, inputClass, slugify } from "../forms/shared";
import { submitAction } from "../forms/form-helpers";

const initialState: ActionState = { status: "idle" };

const primaryButton =
  "inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-paper transition hover:bg-ink-soft disabled:opacity-60";
const secondaryButton =
  "inline-flex items-center gap-3 border border-ink/30 px-5 py-3 text-[10px] uppercase tracking-widest transition hover:border-ink disabled:opacity-60";

function IntentButton({
  intent,
  variant,
  busy,
  disabled,
  children,
}: {
  intent: "publish" | "draft" | "save" | "unpublish";
  variant: "primary" | "secondary";
  busy: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={disabled}
      className={variant === "primary" ? primaryButton : secondaryButton}
    >
      {busy ? <Loader2 size={15} className="animate-spin" /> : children}
    </button>
  );
}

interface BlogFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  blog?: Blog;
}

export function BlogForm({ action, blog }: BlogFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(blog));
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [tags, setTags] = useState(blog?.tags.join(", ") ?? "");
  const [metaTitle, setMetaTitle] = useState(blog?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    blog?.metaDescription ?? "",
  );
  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? "");
  const [pendingIntent, setPendingIntent] = useState<string | null>(null);

  const errors = state.fieldErrors ?? {};
  const isPublished = blog?.status === "PUBLISHED";
  const busy = (intent: string) => isPending && pendingIntent === intent;

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    submitAction(event, formAction, (formData) => {
      formData.set("slug", slugify(slug));
      setPendingIntent(String(formData.get("intent") ?? ""));
    });
  }

  // Enter in a text field "clicks" the first submit button, which used to be
  // Publish. Textareas and the editor are not inputs, so they still get
  // new lines.
  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      event.preventDefault();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="grid gap-5"
    >
      <div className="grid gap-5 border border-ink/20 bg-white/40 p-6 sm:grid-cols-2">
        <Field label="Title" error={errors.title} className="sm:col-span-2">
          <input
            required
            name="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
            placeholder="Choosing a blood pressure monitor"
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
            placeholder="choosing-a-blood-pressure-monitor"
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
            folder="/blog/covers"
            label="cover image"
            resource="blog"
          />
          <input type="hidden" name="coverImage" value={coverImage} />
        </Field>

        <Field label="Excerpt" error={errors.excerpt} className="sm:col-span-2">
          <textarea
            required
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="A short summary shown on the blog listing."
          />
        </Field>

        <Field
          label="Tags (comma separated)"
          error={errors.tags}
          className="sm:col-span-2"
        >
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClass}
            placeholder="Diabetes, Blood pressure, Home care"
          />
        </Field>
      </div>

      <div className="border border-ink/20 bg-white/40 p-6">
        <p className="text-[10px] uppercase tracking-widest">
          Content{" "}
          <span className="text-ink/40">
            — use the toolbar to format text and add images
          </span>
        </p>

        <div className="mt-3">
          <RichTextEditor
            name="content"
            defaultValue={blog?.content ?? ""}
            placeholder="Start writing your post…"
            folder="/blog/content"
            resource="blog"
          />
        </div>

        {errors.content && (
          <p className="mt-1 text-[11px] text-red-700">{errors.content}</p>
        )}
      </div>

      <div className="border border-ink/20 bg-white/40 p-6">
        <p className="text-[10px] uppercase tracking-widest">SEO</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label={`Meta title (${metaTitle.length}/60)`}
            error={errors.metaTitle}
          >
            <input
              name="metaTitle"
              maxLength={60}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className={inputClass}
              placeholder="Defaults to the post title if left blank"
            />
          </Field>
          <Field
            label={`Meta description (${metaDescription.length}/160)`}
            error={errors.metaDescription}
          >
            <input
              name="metaDescription"
              maxLength={160}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={inputClass}
              placeholder="Defaults to the excerpt if left blank"
            />
          </Field>
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-xs text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {isPublished ? (
          <>
            <IntentButton
              intent="save"
              variant="primary"
              busy={busy("save")}
              disabled={isPending}
            >
              Save changes <ArrowUpRight size={15} />
            </IntentButton>
            <IntentButton
              intent="unpublish"
              variant="secondary"
              busy={busy("unpublish")}
              disabled={isPending}
            >
              Unpublish
            </IntentButton>
          </>
        ) : (
          <>
            <IntentButton
              intent="publish"
              variant="primary"
              busy={busy("publish")}
              disabled={isPending}
            >
              Publish <ArrowUpRight size={15} />
            </IntentButton>
            <IntentButton
              intent="draft"
              variant="secondary"
              busy={busy("draft")}
              disabled={isPending}
            >
              {blog ? "Save draft" : "Save as draft"}
            </IntentButton>
          </>
        )}

        {blog && (
          <span className="text-[10px] uppercase tracking-widest text-ink/50">
            Status: {isPublished ? "Published" : "Draft"}
          </span>
        )}
      </div>
    </form>
  );
}
