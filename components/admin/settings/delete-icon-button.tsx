"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteIconButton({
  onDelete,
  confirmMessage,
  disabled,
}: {
  onDelete: () => Promise<void>;
  confirmMessage: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isDisabled = disabled || isPending;

  function handleClick() {
    if (isDisabled) return;
    if (!window.confirm(confirmMessage)) return;

    setError(null);
    startTransition(async () => {
      try {
        await onDelete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete.");
      }
    });
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        disabled={isDisabled}
        aria-label="Delete"
        aria-disabled={isDisabled}
        title={disabled ? confirmMessage : undefined}
        onClick={handleClick}
        className="text-ink/40 transition hover:text-red-700 disabled:opacity-40 disabled:hover:text-ink/40 ml-2"
      >
        <Trash2 size={15} />
      </button>
      {error && (
        <p
          role="alert"
          className="absolute right-0 top-full z-10 mt-1 w-56 bg-red-50 p-2 text-[10px] text-red-700 shadow-sm"
        >
          {error}
        </p>
      )}
    </div>
  );
}
