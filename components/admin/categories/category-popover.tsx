"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryForm, type CategoryFormValues } from "./form";
import { createCategory, updateCategory } from "@/lib/actions/category";

interface CategoryPopoverFormProps {
  mode: "create" | "edit";
  category?: CategoryFormValues;
  parentOptions: { id: string; name: string }[];
  hasChildren?: boolean;
}

export function CategoryPopoverForm({
  mode,
  category,
  parentOptions,
  hasChildren,
}: CategoryPopoverFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const action =
    mode === "edit" && category
      ? updateCategory.bind(null, category.id)
      : createCategory;

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={mode === "edit" ? `Edit ${category?.name}` : undefined}
        className={
          mode === "create"
            ? "flex items-center gap-2 bg-ink px-4 py-3 text-[10px] uppercase tracking-widest text-paper"
            : "text-ink/40 transition hover:text-ink"
        }
      >
        {mode === "create" ? (
          <>
            <Plus size={15} /> New category
          </>
        ) : (
          <Pencil size={16} />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-105 max-h-[85vh] overflow-y-auto"
      >
        <h3 className="mb-4 text-sm font-semibold text-ink">
          {mode === "edit" ? `Edit ${category?.name}` : "New category"}
        </h3>
        <CategoryForm
          action={action}
          category={category}
          parentOptions={parentOptions}
          hasChildren={hasChildren}
          onSuccess={handleSuccess}
        />
      </PopoverContent>
    </Popover>
  );
}
