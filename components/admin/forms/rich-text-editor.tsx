"use client";

import { useCallback, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import { upload } from "@imagekit/next";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { getUploadAuthParams } from "@/lib/upload/get-auth-params";
import { describeUploadError } from "@/lib/upload/describe-upload-error";
import type { UploadResource } from "../upload/image-uploader";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  folder?: string;
  resource: UploadResource;
}

// Tailwind utility overrides for the rendered HTML, scoped to this editor's
// content area. Kept hand-rolled rather than pulling in @tailwindcss/typography.
const proseClass = [
  "min-h-40 px-4 py-3 text-sm text-ink focus:outline-none",
  "[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:first:mt-0",
  "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:first:mt-0",
  "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_p]:mb-3 [&_p]:leading-relaxed",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mb-1",
  "[&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:border-ink/20 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-ink/70",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_mark]:bg-teal/20 [&_mark]:px-0.5",
  "[&_img]:my-3 [&_img]:max-w-full",
  "[&_strong]:font-semibold",
  // Tables (pasted spreadsheet data)
  "[&_.tableWrapper]:mb-3 [&_.tableWrapper]:overflow-x-auto",
  "[&_table]:w-full [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-ink/20 [&_th]:bg-soft [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold",
  "[&_td]:border [&_td]:border-ink/20 [&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top",
  "[&_td_p]:mb-0 [&_th_p]:mb-0",
].join(" ");

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  icon,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`flex h-8 w-8 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-transparent text-ink/60 hover:border-ink/20 hover:bg-ink/5 hover:text-ink"
      }`}
    >
      {icon}
    </button>
  );
}

function Toolbar({
  editor,
  onAddImage,
  isUploadingImage,
}: {
  editor: Editor;
  onAddImage: () => void;
  isUploadingImage: boolean;
}) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-ink/20 bg-ink/2 p-1.5">
      <ToolbarButton
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        icon={<Undo2 size={15} />}
      />
      <ToolbarButton
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        icon={<Redo2 size={15} />}
      />

      <span className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={<Heading1 size={15} />}
      />
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={<Heading2 size={15} />}
      />
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        icon={<Heading3 size={15} />}
      />

      <span className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<BoldIcon size={15} />}
      />
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<ItalicIcon size={15} />}
      />
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough size={15} />}
      />
      <ToolbarButton
        label="Highlight"
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        icon={<Highlighter size={15} />}
      />

      <span className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={<List size={15} />}
      />
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<ListOrdered size={15} />}
      />
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote size={15} />}
      />

      <span className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={setLink}
        icon={<LinkIcon size={15} />}
      />
      <ToolbarButton
        label="Insert image"
        onClick={onAddImage}
        disabled={isUploadingImage}
        icon={
          isUploadingImage ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ImageIcon size={15} />
          )
        }
      />
    </div>
  );
}

/**
 * HTML that gets saved to the database.
 * - An editor with nothing in it saves "" (not "<p></p>"), so the required
 *   "Description" validation can actually catch an empty description.
 * - Blank paragraphs are saved as <p><br></p> so the spacing you add with
 *   Enter shows up on the storefront too (a bare <p></p> collapses to zero height).
 * - Trailing blank paragraphs are dropped (Tiptap always keeps one at the end).
 */
function serializeEditor(editor: Editor) {
  if (editor.isEmpty) return "";
  return editor
    .getHTML()
    .replace(/(?:<p><\/p>)+$/, "")
    .replace(/<p><\/p>/g, "<p><br></p>");
}

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Write something…",
  folder = "/zanmedweb",
  resource,
}: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // StarterKit v3 already bundles the Link extension, so it is configured
      // here. Registering Link a second time caused the
      // "Duplicate extension names found: ['link']" warning.
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Highlight,
      TiptapImage,
      // Without these, pasted tables are flattened to run-together text
      // ("ModelPriceX15,000") and the structure is lost on the first edit.
      Table,
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: { class: proseClass },
    },
    onUpdate: ({ editor }) => setHtml(serializeEditor(editor)),
  });

  const addImage = useCallback(() => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploadError("");
      setIsUploadingImage(true);

      try {
        const { publicKey, params } = await getUploadAuthParams(1, resource);
        const result = await upload({
          file,
          fileName: file.name,
          token: params[0].token,
          expire: params[0].expire,
          signature: params[0].signature,
          publicKey,
          folder,
          useUniqueFileName: true,
        });

        if (result.url) {
          editor.chain().focus().setImage({ src: result.url }).run();
        }
      } catch (err) {
        setUploadError(describeUploadError(err));
      } finally {
        setIsUploadingImage(false);
      }
    };
    input.click();
  }, [editor, resource, folder]);

  if (!editor) {
    return (
      <div className="flex h-52 items-center justify-center border border-ink/20 bg-white/40 text-xs text-ink/40">
        Loading editor…
      </div>
    );
  }

  return (
    <div onClick={(e) => e.preventDefault()}>
      <div className="border border-ink/20 bg-white">
        <Toolbar
          editor={editor}
          onAddImage={addImage}
          isUploadingImage={isUploadingImage}
        />
        <EditorContent editor={editor} />
      </div>
      {uploadError && (
        <p className="mt-1 text-[11px] text-red-700">{uploadError}</p>
      )}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
