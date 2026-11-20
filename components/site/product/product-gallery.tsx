"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function normalizeImageUrls(rawImages: unknown): string[] {
  if (!rawImages) return [];

  let list: unknown = rawImages;

  if (typeof list === "string") {
    try {
      list = JSON.parse(list);
    } catch {
      list = [list];
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .flatMap((item) => {
      if (typeof item !== "string") return [];
      let str = item.trim();

      if (str.startsWith("[") && str.endsWith("]")) {
        try {
          const parsed = JSON.parse(str);
          if (Array.isArray(parsed)) {
            return parsed.filter((s): s is string => typeof s === "string");
          }
        } catch {
          str = str.replace(/^\[\s*"?\vert{}"?\s*\]$/g, "");
        }
      }

      str = str.replace(/^["']|["']$/g, "");
      return str ? [str] : [];
    })
    .map((url) => {
      return url.replace(/^(https?):\/([^/])/i, "$1://$2");
    });
}

export function ProductGallery({
  images,
  name,
  badge,
  discountPercent,
}: {
  images: string[] | string;
  name: string;
  badge?: string | null;
  discountPercent?: number | null;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [magnifyOrigin, setMagnifyOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  const normalizedImages = useMemo(() => normalizeImageUrls(images), [images]);
  const safeImages =
    normalizedImages.length > 0 ? normalizedImages : ["/placeholder.png"];
  const hasMultiple = safeImages.length > 1;

  function showPrev() {
    setActive((i) => (i + safeImages.length - 1) % safeImages.length);
  }
  function showNext() {
    setActive((i) => (i + 1) % safeImages.length);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMagnifyOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  useEffect(() => {
    if (!zoom || !hasMultiple) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoom, hasMultiple]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      {hasMultiple && (
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:w-16 lg:shrink-0 lg:flex-col lg:overflow-x-visible">
          {safeImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${safeImages.length}`}
              aria-current={active === i}
              className={cn(
                "relative aspect-square w-14 shrink-0 rounded-md border bg-card transition-colors lg:w-full overflow-hidden",
                active === i
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Image src={src} alt="" fill className="object-cover p-1" />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 flex-1 lg:order-2">
        <div
          ref={frameRef}
          onMouseEnter={() => setIsMagnifying(true)}
          onMouseLeave={() => setIsMagnifying(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-4/3 max-h-96 w-full overflow-hidden rounded-md border border-border bg-card shadow-xs"
        >
          {discountPercent ? (
            <span className="absolute left-3 top-3 z-10 bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-destructive-foreground">
              −{discountPercent}%
            </span>
          ) : badge ? (
            <span className="absolute left-3 top-3 z-10 bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              {badge}
            </span>
          ) : null}

          <Image
            src={safeImages[active]}
            alt={name}
            fill
            priority
            className={cn(
              "object-cover transition-transform duration-200 ease-out p-2",
              isMagnifying && "scale-[1.8]",
            )}
            style={{
              transformOrigin: `${magnifyOrigin.x}% ${magnifyOrigin.y}%`,
            }}
          />

          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label="Open full-size view"
            className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-md border border-border bg-background/90 text-foreground transition-colors hover:border-primary hover:text-primary backdrop-blur-xs shadow-xs"
          >
            <ZoomIn size={15} />
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-background/90 text-foreground lg:hidden shadow-xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-background/90 text-foreground lg:hidden shadow-xs"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent
          showCloseButton={false}
          className="left-1/2 top-1/2 h-[60vh] w-[80vw] md:h-[85vh] md:w-[75vw] max-w-none sm:max-w-none -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-background p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">
            Expanded image of {name}
          </DialogTitle>

          <button
            type="button"
            onClick={() => setZoom(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary shadow-xs"
          >
            <X size={17} />
          </button>

          <div className="relative h-full w-full p-6">
            <Image
              src={safeImages[active]}
              alt={`Expanded view of ${name}`}
              fill
              className="object-contain p-4"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary shadow-xs"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary shadow-xs"
              >
                <ChevronRight size={18} />
              </button>

              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-card px-3 py-1 font-mono text-xs font-bold border border-border text-foreground shadow-xs">
                {active + 1} / {safeImages.length}
              </span>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
