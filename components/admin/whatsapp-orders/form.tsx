"use client";

import { useActionState } from "react";
import type {
  WhatsAppOrder,
  WhatsAppOrderStatus,
} from "@/generated/prisma/client";
import type { ActionState } from "@/lib/utils";
import { inputClass } from "../forms/shared";

const initialState: ActionState = { status: "idle" };

const STATUSES: WhatsAppOrderStatus[] = [
  "CLICKED",
  "CONTACTED",
  "CONFIRMED",
  "FULFILLED",
  "CANCELLED",
];

interface WhatsAppOrderStatusFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  order: WhatsAppOrder;
}

export function WhatsAppOrderStatusForm({
  action,
  order,
}: WhatsAppOrderStatusFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex items-start gap-3">
      <label className="text-[10px] uppercase tracking-widest">
        Status
        <select
          name="status"
          defaultValue={order.status}
          className={inputClass}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-[11px] normal-case tracking-normal text-red-700">
            {errors.status}
          </p>
        )}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 border border-ink bg-ink px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-paper transition hover:bg-ink-soft disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Update"}
      </button>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-5 text-xs text-red-700">
          {state.message}
        </p>
      )}
    </form>
  );
}
