"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/admin/data-table/data-table-features";
import { formatCurrency } from "@/lib/utils";
import {
  WhatsAppOrderRowValues,
  WhatsAppOrderStatusPopover,
} from "./status-popover";

export interface AdminWhatsAppOrderRow extends WhatsAppOrderRowValues {
  totalEstimate: number | null;
  source: string;
  createdAt: Date;
  items: { product: { name: string }; quantity: number }[];
}

const STATUS_COLOR: Record<string, string> = {
  CLICKED: "text-ink/50",
  CONTACTED: "text-blue-600",
  CONFIRMED: "text-bronze-dark",
  FULFILLED: "text-green-700",
  CANCELLED: "text-red-600",
};

export const whatsAppOrderColumns: ColumnDef<
  DataTableFeatures,
  AdminWhatsAppOrderRow
>[] = [
  {
    id: "order",
    accessorFn: (row) => row.customerName ?? row.id,
    header: "Order",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="min-w-0">
          <p className="truncate font-medium">
            {order.customerName || "Unnamed lead"}
          </p>
          <p className="truncate text-[10px] text-ink/40">
            {order.items
              .map((i) => `${i.product.name} x${i.quantity}`)
              .join(", ")}
          </p>
        </div>
      );
    },
    sortFn: "text",
  },
  {
    id: "source",
    accessorFn: (row) => row.source,
    header: "Source",
    cell: ({ row }) => (
      <span className="text-[10px] uppercase tracking-widest text-ink/50">
        {row.original.source.replace("_", " ")}
      </span>
    ),
    sortFn: "text",
  },
  {
    id: "total",
    accessorFn: (row) => row.totalEstimate ?? 0,
    header: "Est. total",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-ink">
        {row.original.totalEstimate != null
          ? formatCurrency(row.original.totalEstimate)
          : "—"}
      </span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`text-[10px] uppercase tracking-widest ${STATUS_COLOR[row.original.status]}`}
      >
        {row.original.status}
      </span>
    ),
    sortFn: "text",
  },
  {
    id: "date",
    accessorFn: (row) => row.createdAt.getTime(),
    header: "Received",
    cell: ({ row }) => (
      <span className="text-xs text-ink/60">
        {row.original.createdAt.toLocaleDateString()}
      </span>
    ),
    sortFn: "alphanumeric",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <WhatsAppOrderStatusPopover order={row.original} />
      </div>
    ),
  },
];

export const whatsAppOrderColumnMeta = {
  order: { primary: true },
  source: { hideBelow: "md" as const },
  total: { primary: true },
  status: { primary: true },
  date: { hideBelow: "sm" as const },
};
