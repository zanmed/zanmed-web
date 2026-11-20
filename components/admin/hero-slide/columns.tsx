"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/admin/data-table/data-table-features";
import { DeleteIconButton } from "@/components/admin/settings/delete-icon-button";
import { deleteHeroSlide } from "@/lib/actions/hero-slides";
import { HeroSlidePopoverForm } from "./hero-slide-popover";
import type { HeroSlideFormValues } from "./form";

export type AdminHeroSlideRow = HeroSlideFormValues;

export const heroSlideColumns: ColumnDef<
  DataTableFeatures,
  AdminHeroSlideRow
>[] = [
  {
    id: "slide",
    accessorFn: (row) => row.title,
    header: "Slide",
    cell: ({ row }) => {
      const slide = row.original;
      return (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-ink/5">
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">
              {slide.title} <span className="text-ink/40">{slide.accent}</span>
            </p>
            <p className="truncate text-[10px] text-ink/40">{slide.eyebrow}</p>
          </div>
        </div>
      );
    },
    sortFn: "text",
  },
  {
    id: "href",
    accessorFn: (row) => row.href,
    header: "Links to",
    cell: ({ row }) => (
      <span className="text-xs text-ink/70">{row.original.href}</span>
    ),
    sortFn: "text",
  },
  {
    id: "order",
    accessorFn: (row) => row.order,
    header: "Order",
    cell: ({ row }) => (
      <span className="text-xs text-ink/70">{row.original.order}</span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "active",
    accessorFn: (row) => (row.active ? 1 : 0),
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`text-[10px] uppercase tracking-widest ${row.original.active ? "text-bronze-dark" : "text-ink/40"}`}
      >
        {row.original.active ? "Active" : "Hidden"}
      </span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const slide = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <HeroSlidePopoverForm mode="edit" slide={slide} />
          <DeleteIconButton
            onDelete={deleteHeroSlide.bind(null, slide.id)}
            confirmMessage={`Delete slide "${slide.title}"?`}
          />
        </div>
      );
    },
  },
];

export const heroSlideColumnMeta = {
  slide: { primary: true },
  href: { hideBelow: "md" as const },
  order: { hideBelow: "sm" as const },
  active: { primary: true },
};
