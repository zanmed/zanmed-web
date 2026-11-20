"use client";

import { Fragment, useMemo, useState } from "react";
import {
  useTable,
  type ColumnDef,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { features, type DataTableFeatures } from "./data-table-features";

export interface DataTableColumnMeta {
  hideBelow?: "sm" | "md" | "lg" | "xl";
  primary?: boolean;
}

const HIDE_BELOW_CLASS: Record<
  NonNullable<DataTableColumnMeta["hideBelow"]>,
  string
> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

/** Read a dot-path ("category.name") from an object. */
function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** Optional per-row override: a precomputed `searchText` string. */
function getRowSearchText(row: unknown): string | undefined {
  if (row && typeof row === "object" && "searchText" in row) {
    const value = (row as { searchText?: unknown }).searchText;
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
}

function buildSearchText(row: unknown, searchKeys: string[]): string {
  const override = getRowSearchText(row);
  if (override !== undefined) return override.toLowerCase();

  return searchKeys
    .map((key) => getByPath(row, key))
    .filter((v) => v !== null && v !== undefined)
    .map((v) => String(v))
    .join(" ")
    .toLowerCase();
}

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  columnMeta?: Record<string, DataTableColumnMeta>;
  /** Dot-paths of fields to search, e.g. ["name", "slug", "category.name"] */
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  headerActions?: React.ReactNode;
  title?: string;
  description?: string;
  emptyMessage?: string;
  pageSize?: number;
  isRowExpanded?: (row: TData) => boolean;
  renderExpandedContent?: (row: TData) => React.ReactNode;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  columnMeta = {},
  searchKeys = [],
  searchPlaceholder = "Search…",
  filters,
  headerActions,
  title,
  description,
  emptyMessage = "No results found.",
  pageSize = 10,
  isRowExpanded,
  renderExpandedContent,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [query, setQuery] = useState("");

  const searchable = useMemo(
    () =>
      searchKeys.length > 0 ||
      data.some((row) => getRowSearchText(row) !== undefined),
    [data, searchKeys],
  );

  // Build the searchable text once per data change, not on every keystroke.
  const indexed = useMemo(
    () =>
      searchable
        ? data.map((row) => ({ row, text: buildSearchText(row, searchKeys) }))
        : [],
    [data, searchKeys, searchable],
  );

  const searchedData = useMemo(() => {
    if (!searchable) return data;
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return data;
    return indexed
      .filter(({ text }) => terms.every((t) => text.includes(t)))
      .map(({ row }) => row);
  }, [data, indexed, query, searchable]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const table = useTable({
    features,
    data: searchedData,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  });

  const rows = table.getRowModel().rows;
  const primaryIds = Object.entries(columnMeta)
    .filter(([, m]) => m.primary)
    .map(([id]) => id);

  const hasQuery = query.trim().length > 0;

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden border border-border bg-white/40">
      {(title || headerActions) && (
        <div className="flex w-full min-w-0 flex-col items-start gap-2 border-b border-border px-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="truncate font-serif text-xl sm:text-2xl md:text-3xl">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 truncate text-[10px] text-ink/50 sm:mt-1 sm:text-xs">
                {description}
              </p>
            )}
          </div>
          {headerActions && <div className="shrink-0">{headerActions}</div>}
        </div>
      )}

      {(filters || searchable) && (
        <div className="flex w-full min-w-0 flex-col gap-2 border-b border-border px-1.5 py-2">
          {filters}
          {searchable && (
            <div className="flex w-full min-w-0 items-center gap-2 border border-border bg-white/60 px-2">
              <Search size={12} className="shrink-0 text-ink/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full min-w-0 bg-transparent py-1.5 text-xs outline-none placeholder:text-ink/40 [&::-webkit-search-cancel-button]:hidden"
              />
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  aria-label="Clear search"
                  className="shrink-0 text-ink/40 transition hover:text-ink"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <ul className="w-full min-w-0 divide-y divide-border md:hidden">
        {rows.map((row) => {
          const allCells = row.getAllCells();
          const actionsCell = allCells.find((c) => c.column.id === "actions");
          const primaryCells = allCells.filter((c) =>
            primaryIds.includes(c.column.id),
          );
          const secondaryCells = allCells.filter(
            (c) =>
              c.column.id !== "actions" && !primaryIds.includes(c.column.id),
          );
          const expanded = isRowExpanded?.(row.original) ?? false;
          return (
            <li
              key={row.id}
              className="flex w-full min-w-0 flex-col gap-1.5 px-2 py-3"
            >
              <div className="flex w-full min-w-0 items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
                  {primaryCells.map((cell) => (
                    <div key={cell.id} className="min-w-0 truncate text-sm">
                      <table.FlexRender cell={cell} />
                    </div>
                  ))}
                </div>
                {actionsCell && (
                  <div className="shrink-0">
                    <table.FlexRender cell={actionsCell} />
                  </div>
                )}
              </div>
              {secondaryCells.length > 0 && (
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink/60">
                  {secondaryCells.map((cell) => (
                    <div
                      key={cell.id}
                      className="min-w-0 max-w-full overflow-hidden"
                    >
                      <table.FlexRender cell={cell} />
                    </div>
                  ))}
                </div>
              )}
              {expanded && renderExpandedContent && (
                <div className="pt-3">
                  {renderExpandedContent(row.original)}
                </div>
              )}
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="px-2 py-8 text-center text-sm text-ink/50">
            {emptyMessage}
          </li>
        )}
      </ul>

      <div className="hidden w-full min-w-0 overflow-x-auto md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = columnMeta[header.column.id];
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        meta?.hideBelow ? HIDE_BELOW_CLASS[meta.hideBelow] : ""
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => {
                const expanded = isRowExpanded?.(row.original) ?? false;
                return (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getAllCells().map((cell) => {
                        const meta = columnMeta[cell.column.id];
                        return (
                          <TableCell
                            key={cell.id}
                            className={
                              meta?.hideBelow
                                ? HIDE_BELOW_CLASS[meta.hideBelow]
                                : ""
                            }
                          >
                            <table.FlexRender cell={cell} />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {expanded && renderExpandedContent && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="bg-[#eee9df]/40"
                        >
                          {renderExpandedContent(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-ink/50"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex w-full min-w-0 items-center justify-between gap-3 border-t border-border px-2 py-3">
        <p className="truncate text-xs text-ink/50">
          Page {pagination.pageIndex + 1} of {table.getPageCount() || 1} ·{" "}
          {searchedData.length}{" "}
          {searchedData.length === 1 ? "result" : "results"}
          {hasQuery && ` of ${data.length}`}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1 border border-ink/20 px-2 py-1 text-xs transition hover:bg-ink/5 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1 border border-ink/20 px-2 py-1 text-xs transition hover:bg-ink/5 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
