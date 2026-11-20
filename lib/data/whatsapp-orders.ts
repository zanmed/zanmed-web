import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getAllWhatsAppOrdersForAdmin() {
  "use cache";
  cacheTag("whatsapp-orders");
  cacheLife("default");

  return prisma.whatsAppOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getWhatsAppOrderById(id: string) {
  "use cache";
  cacheTag("whatsapp-orders", `whatsapp-order-${id}`);
  cacheLife("default");

  return prisma.whatsAppOrder.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}
