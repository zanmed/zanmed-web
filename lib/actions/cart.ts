"use server";

import { prisma } from "@/lib/prisma";
import { buildWhatsAppLink, buildCartWhatsAppMessage } from "@/lib/constants";

interface CartWhatsAppItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
}

export async function logCartWhatsAppOrder(items: CartWhatsAppItem[]) {
  if (!items.length) return { url: null };

  const message = buildCartWhatsAppMessage(items);
  const totalEstimate = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Never let a logging failure block the customer from reaching WhatsApp —
  // the link is still returned even if the write below throws.
  try {
    await prisma.whatsAppOrder.create({
      data: {
        message,
        source: "CART",
        status: "CLICKED",
        totalEstimate,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            priceAtOrder: i.price,
          })),
        },
      },
    });
  } catch (err) {
    console.error("Failed to log cart WhatsApp order", err);
  }

  return { url: buildWhatsAppLink(message) };
}
