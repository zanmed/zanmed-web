"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HIDDEN_ON, SITE, TOPICS, buildWhatsAppLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";

export function WhatsAppChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  const onProductPage = /^\/products\/[^/]+/.test(pathname);
  const pageUrl = `${SITE.siteUrl}${pathname}`;
  const hrefFor = (message: string) =>
    buildWhatsAppLink(`${message}\n\nPage: ${pageUrl}`);

  return (
    <div
      ref={rootRef}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3",
        onProductPage && "max-lg:hidden",
      )}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat on WhatsApp"
          className="w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-md border border-line bg-paper shadow-xl"
        >
          <div className="flex items-center gap-3 bg-[#1f9d55] px-4 py-3 text-white">
            <WhatsAppIcon className="size-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{SITE.name}</p>
              <p className="text-xs text-white/90">
                Typically replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex size-7 shrink-0 items-center justify-center rounded transition-colors hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-3.5">
            <p className="rounded bg-soft p-3 text-sm leading-relaxed text-ink">
              Hello! How can we help you today? Pick a topic or start a direct
              chat below.
            </p>

            <ul className="mt-3 flex flex-col gap-1.5">
              {TOPICS.map((topic) => (
                <li key={topic.label}>
                  <a
                    href={hrefFor(topic.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 rounded border border-line px-3.5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-soft"
                  >
                    <span>{topic.label}</span>
                    <ChevronRight size={14} className="text-muted shrink-0" />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={hrefFor("Hello Zanmed Medical Supplies, ")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded bg-[#1f9d55] text-sm font-semibold text-white transition-colors hover:bg-[#1f9d55]/90 shadow-sm"
            >
              <WhatsAppIcon className="size-4" /> Start general chat
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        className="flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#1f9d55] px-4 text-white shadow-lg transition-all hover:bg-[#1f9d55]/90"
      >
        {open ? <X size={22} /> : <WhatsAppIcon className="size-6" />}
        {!open && (
          <span className="hidden text-sm font-semibold sm:inline tracking-wide">
            Chat with us
          </span>
        )}
      </button>
    </div>
  );
}
