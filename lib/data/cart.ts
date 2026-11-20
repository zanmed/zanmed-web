import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const CART_COOKIE = "cartSessionId";

export async function getCart() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value;
  if (!sessionId) return null;

  return prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
