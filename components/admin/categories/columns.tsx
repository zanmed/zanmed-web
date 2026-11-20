"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/admin/data-table/data-table-features";
import { DeleteIconButton } from "@/components/admin/settings/delete-icon-button";
import { deleteCategory } from "@/lib/actions/category";
import { CategoryPopoverForm } from "./category-popover";

export interface AdminCategoryRow {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  parentId: string | null;
  parent: { name: string } | null;
  childCount: number;
  productCount: number;
}

export function createCategoryColumns(
  parentOptions: { id: string; name: string }[],
): ColumnDef<DataTableFeatures, AdminCategoryRow>[] {
  return [
    {
      id: "category",
      accessorFn: (row) => row.name,
      header: "Category",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex min-w-0 items-center gap-3">
            {category.icon && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-border bg-white">
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">
                {category.parent && <span className="text-ink/30">— </span>}
                {category.name}
              </p>
              <p className="truncate text-[10px] text-ink/40">
                /{category.slug}
              </p>
            </div>
          </div>
        );
      },
      sortFn: "text",
    },
    {
      id: "type",
      accessorFn: (row) => (row.parent ? row.parent.name : "Top-level"),
      header: "Type",
      cell: ({ row }) => {
        const category = row.original;
        return category.parent ? (
          <span className="text-xs text-ink/60">
            Subcategory of{" "}
            <span className="font-medium text-ink">{category.parent.name}</span>
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-bronze-dark">
            Top-level
            {category.childCount > 0 ? ` · ${category.childCount} sub` : ""}
          </span>
        );
      },
      sortFn: "text",
    },
    {
      id: "products",
      accessorFn: (row) => row.productCount,
      header: "Products",
      cell: ({ row }) => (
        <span className="text-xs text-ink/70">{row.original.productCount}</span>
      ),
      sortFn: "alphanumeric",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const category = row.original;
        const availableParents = parentOptions.filter(
          (option) => option.id !== category.id,
        );
        const confirmMessage =
          category.childCount > 0
            ? `"${category.name}" has ${category.childCount} subcategor${category.childCount === 1 ? "y" : "ies"}. Delete or reassign them before deleting this category.`
            : `Delete "${category.name}"?`;
        return (
          <div className="flex items-center justify-end gap-3">
            <CategoryPopoverForm
              mode="edit"
              category={category}
              parentOptions={availableParents}
              hasChildren={category.childCount > 0}
            />
            <DeleteIconButton
              onDelete={deleteCategory.bind(null, category.id)}
              confirmMessage={confirmMessage}
              disabled={category.childCount > 0}
            />
          </div>
        );
      },
    },
  ];
}

export const categoryColumnMeta = {
  category: { primary: true },
  type: { primary: true },
  products: { hideBelow: "sm" as const },
};
