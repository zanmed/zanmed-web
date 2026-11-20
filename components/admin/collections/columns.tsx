"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/admin/data-table/data-table-features";
import { DeleteIconButton } from "@/components/admin/settings/delete-icon-button";
import { deleteCollection } from "@/lib/actions/collections";
import { CollectionPopoverForm } from "./collection-popover";

export interface AdminCollectionRow {
  id: string;
  slug: string;
  name: string;
  coverImage: string | null;
  description: string | null;
  productCount: number;
}

export const collectionColumns: ColumnDef<
  DataTableFeatures,
  AdminCollectionRow
>[] = [
  {
    id: "collection",
    accessorFn: (row) => row.name,
    header: "Collection",
    cell: ({ row }) => {
      const collection = row.original;
      return (
        <div className="flex min-w-0 items-center gap-3">
          {collection.coverImage && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-border bg-white">
              <Image
                src={collection.coverImage}
                alt={collection.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{collection.name}</p>
            <p className="truncate text-[10px] text-ink/40">
              /{collection.slug}
            </p>
          </div>
        </div>
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
      const collection = row.original;
      const confirmMessage =
        collection.productCount > 0
          ? `"${collection.name}" has ${collection.productCount} product${collection.productCount === 1 ? "" : "s"} assigned. Reassign them before deleting this collection.`
          : `Delete "${collection.name}"?`;
      return (
        <div className="flex items-center justify-end gap-3">
          <CollectionPopoverForm mode="edit" collection={collection} />
          <DeleteIconButton
            onDelete={async () => {
              await deleteCollection(collection.slug);
            }}
            confirmMessage={confirmMessage}
            disabled={collection.productCount > 0}
          />
        </div>
      );
    },
  },
];

export const collectionColumnMeta = {
  collection: { primary: true },
  products: { hideBelow: "sm" as const },
};
