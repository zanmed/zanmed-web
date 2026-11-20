"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HeroSlideForm, type HeroSlideFormValues } from "./form";
import { createHeroSlide, updateHeroSlide } from "@/lib/actions/hero-slides";

export function HeroSlidePopoverForm({
  mode,
  slide,
}: {
  mode: "create" | "edit";
  slide?: HeroSlideFormValues;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const action =
    mode === "edit" && slide
      ? updateHeroSlide.bind(null, slide.id)
      : createHeroSlide;

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  const triggerElement =
    mode === "create" ? (
      <button
        type="button"
        className="flex items-center gap-2 bg-ink px-4 py-3 text-[10px] uppercase tracking-widest text-paper"
      >
        <Plus size={15} /> New slide
      </button>
    ) : (
      <button
        type="button"
        aria-label="Edit"
        className="text-ink/40 transition hover:text-ink"
      >
        <Pencil size={16} />
      </button>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={triggerElement} />
      <PopoverContent
        align="end"
        className="w-115 max-h-[85vh] overflow-y-auto"
      >
        <h3 className="mb-4 text-sm font-semibold text-ink">
          {mode === "edit" ? `Edit "${slide?.title}"` : "New slide"}
        </h3>
        <HeroSlideForm
          action={action}
          slide={slide}
          onSuccess={handleSuccess}
        />
      </PopoverContent>
    </Popover>
  );
}
