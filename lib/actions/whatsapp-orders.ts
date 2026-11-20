"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/require-permission";
import { whatsAppOrderStatusSchema } from "@/lib/validations/whatsapp-order";
import { fieldErrorsFrom, type ActionState } from "@/lib/utils";

export async function updateWhatsAppOrderStatus(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission({ whatsAppOrder: ["update"] });

  const parsed = whatsAppOrderStatusSchema.safeParse({
    status: formData.get("status"),
    customerName: formData.get("customerName") || "",
    customerPhone: formData.get("customerPhone") || "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  await prisma.whatsAppOrder.update({
    where: { id },
    data: {
      status: parsed.data.status,
      customerName: parsed.data.customerName || null,
      customerPhone: parsed.data.customerPhone || null,
    },
  });

  revalidatePath("/admin/whatsapp-orders");

  return { status: "success", message: "Order updated." };
}
