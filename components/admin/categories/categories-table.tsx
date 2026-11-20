"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import {
  createCategoryColumns,
  categoryColumnMeta,
  type AdminCategoryRow,
} from "./columns";

type CategoryRow = AdminCategoryRow & { searchText: string };

interface CategoriesTableProps {
  rows: CategoryRow[];
  parentOptions: { id: string; name: string }[];
}

export function CategoriesTable({ rows, parentOptions }: CategoriesTableProps) {
  const columns = createCategoryColumns(parentOptions);

  return (
    <DataTable
      columns={columns}
      data={rows}
      columnMeta={categoryColumnMeta}
      searchPlaceholder="Search categories…"
      title="All categories"
      description={`${rows.length} total`}
      emptyMessage="No categories yet."
    />
  );
}
