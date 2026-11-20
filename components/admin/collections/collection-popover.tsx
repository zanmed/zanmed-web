"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CollectionForm, type CollectionFormValues } from "./form";
import { createCollection, updateCollection } from "@/lib/actions/collections";

interface CollectionPopoverFormProps {
  mode: "create" | "edit";
  collection?: CollectionFormValues;
}

export function CollectionPopoverForm({
  mode,
  collection,
}: CollectionPopoverFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const action =
    mode === "edit" && collection
      ? updateCollection.bind(null, collection.id)
      : createCollection;

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={mode === "edit" ? "Edit" : undefined}
        className={
          mode === "create"
            ? "flex items-center gap-2 bg-ink px-4 py-3 text-[10px] uppercase tracking-widest text-paper"
            : "text-ink/40 transition hover:text-ink"
        }
      >
        {mode === "create" ? (
          <>
            <Plus size={15} /> New collection
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
          {mode === "edit" ? `Edit ${collection?.name}` : "New collection"}
        </h3>
        <CollectionForm
          action={action}
          collection={collection}
          onSuccess={handleSuccess}
        />
      </PopoverContent>
    </Popover>
  );
}
