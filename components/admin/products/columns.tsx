"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { deleteProduct } from "@/lib/actions/products";
import { formatCurrency } from "@/lib/utils";
import type { DataTableFeatures } from "@/components/admin/data-table/data-table-features";
import { DeleteIconButton } from "../settings/delete-icon-button";

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  inStock: boolean;
  featured: boolean;
  category: { name: string } | null;
}

export const productColumns: ColumnDef<DataTableFeatures, AdminProductRow>[] = [
  {
    id: "product",
    accessorFn: (row) => row.name,
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-border bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{product.name}</p>
            <p className="truncate text-[10px] text-ink/40">/{product.slug}</p>
          </div>
        </div>
      );
    },
    sortFn: "text",
  },
  {
    id: "category",
    accessorFn: (row) => row.category?.name ?? "—",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs text-ink/70">
        {row.original.category?.name ?? "—"}
      </span>
    ),
    sortFn: "text",
  },
  {
    id: "price",
    accessorFn: (row) => row.price,
    header: "Price",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-ink">
        {formatCurrency(row.original.price)}
      </span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "stock",
    accessorFn: (row) => (row.inStock ? 1 : 0),
    header: "Stock",
    cell: ({ row }) => (
      <span
        className={`text-[10px] uppercase tracking-widest ${
          row.original.inStock ? "text-bronze-dark" : "text-red-600"
        }`}
      >
        {row.original.inStock ? "In stock" : "Out of stock"}
      </span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "featured",
    accessorFn: (row) => (row.featured ? 1 : 0),
    header: "Featured",
    cell: ({ row }) => (
      <span className="text-[10px] uppercase tracking-widest text-ink/50">
        {row.original.featured ? "Yes" : "—"}
      </span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/products/${product.slug}/edit`}
            aria-label="Edit"
            className="text-ink/40 transition hover:text-ink"
          >
            <Pencil size={16} />
          </Link>
          <DeleteIconButton
            onDelete={async () => {
              await deleteProduct(product.slug);
            }}
            confirmMessage={`Delete "${product.name}"?`}
          />
        </div>
      );
    },
  },
];

export const productColumnMeta = {
  product: { primary: true },
  category: { hideBelow: "md" as const },
  brand: { hideBelow: "lg" as const },
  price: { primary: true },
  stock: { hideBelow: "sm" as const },
  featured: { hideBelow: "xl" as const },
};
