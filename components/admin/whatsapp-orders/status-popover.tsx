"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, inputClass } from "../forms/shared";
import type { ActionState } from "@/lib/utils";
import { updateWhatsAppOrderStatus } from "@/lib/actions/whatsapp-orders";

const initialState: ActionState = { status: "idle" };
const STATUS_OPTIONS = [
  "CLICKED",
  "CONTACTED",
  "CONFIRMED",
  "FULFILLED",
  "CANCELLED",
] as const;

export interface WhatsAppOrderRowValues {
  id: string;
  status: (typeof STATUS_OPTIONS)[number];
  customerName: string | null;
  customerPhone: string | null;
}

export function WhatsAppOrderStatusPopover({
  order,
}: {
  order: WhatsAppOrderRowValues;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const action = updateWhatsAppOrderStatus.bind(null, order.id);
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success") {
      setOpen(false);
      router.refresh();
    }
  }, [state.status, router]);

  const errors = state.fieldErrors ?? {};

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Update status"
            className="text-ink/40 transition hover:text-ink"
          >
            <Pencil size={16} />
          </button>
        }
      />
      <PopoverContent align="end" className="w-90">
        <h3 className="mb-4 text-sm font-semibold text-ink">Update order</h3>
        <form action={formAction} className="grid gap-4">
          <Field label="Status" error={errors.status}>
            <select
              name="status"
              defaultValue={order.status}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Customer name" error={errors.customerName}>
            <input
              name="customerName"
              defaultValue={order.customerName ?? ""}
              className={inputClass}
              placeholder="Optional"
            />
          </Field>

          <Field label="Customer phone" error={errors.customerPhone}>
            <input
              name="customerPhone"
              defaultValue={order.customerPhone ?? ""}
              className={inputClass}
              placeholder="Optional"
            />
          </Field>

          {state.status === "error" && state.message && (
            <p role="alert" className="text-xs text-red-700">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-paper transition hover:bg-ink-soft disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
