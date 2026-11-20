"use client";

import { Filter, RotateCcw } from "lucide-react";
import type { SpecEntry } from "@/lib/search-params";

export type SpecFilterGroup = {
  title: string;
  options: string[];
};

interface SpecFiltersProps {
  groups: SpecFilterGroup[];
  selected: SpecEntry[];
  onToggle: (label: string, value: string) => void;
  onClear: () => void;
  variant?: "panel" | "plain";
}

export default function SpecFilters({
  groups,
  selected,
  onToggle,
  onClear,
  variant = "panel",
}: SpecFiltersProps) {
  if (!groups.length) {
    return null;
  }

  const isPanel = variant === "panel";

  return (
    <section
      className={
        isPanel
          ? "min-w-0 overflow-hidden rounded-sm border border-gray-200 bg-white"
          : "min-w-0"
      }
    >
      {isPanel && (
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Filter
                size={15}
                className="shrink-0 text-orange-500"
                aria-hidden="true"
              />
              <h2 className="truncate text-sm font-semibold text-gray-900">
                Filter by specs
              </h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">Refine your search</p>
          </div>

          {selected.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-xs font-medium text-orange-500 transition-colors hover:text-orange-600"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div
        className={
          isPanel ? "divide-y divide-gray-100 px-4" : "divide-y divide-gray-100"
        }
      >
        {groups.map((group) => (
          <fieldset
            key={group.title}
            className="min-w-0 border-0 py-2 first:pt-0"
          >
            <legend className="mb-2 max-w-full text-[10px] font-bold uppercase tracking-wide text-gray-500 py-1">
              {group.title}
            </legend>

            <div className="space-y-1.5">
              {group.options.map((option) => {
                const id = `spec-${group.title}-${option}`
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-");

                const checked = selected.some(
                  (spec) => spec.label === group.title && spec.value === option,
                );

                return (
                  <label
                    key={option}
                    htmlFor={id}
                    className="flex min-w-0 cursor-pointer items-start gap-1.5 text-[11px] leading-5 text-gray-600 transition-colors hover:text-gray-900"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(group.title, option)}
                      className="mt-0.5 size-3 shrink-0 cursor-pointer accent-gray-900"
                    />
                    <span className="min-w-0 wrap-break-word">{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {isPanel && selected.length > 0 && (
        <div className="border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={onClear}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
