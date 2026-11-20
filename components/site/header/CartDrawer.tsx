"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore, selectCartCount } from "@/lib/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const checkoutViaWhatsApp = useCartStore(
    (state) => state.checkoutViaWhatsApp,
  );
  const isSendingWhatsApp = useCartStore((state) => state.isSendingWhatsApp);
  const itemCount = useCartStore(selectCartCount);

  const handleWhatsAppCheckout = async () => {
    const res = await checkoutViaWhatsApp();
    if (res.success && res.url) {
      window.open(res.url, "_blank", "noopener,noreferrer");
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-card p-0 text-foreground sm:max-w-xs md:max-w-sm border-l border-border"
      >
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-3.5 py-3">
          <SheetTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
            <span>Procurement Order Desk</span>
            <span className="rounded-full bg-soft px-2 py-0.5 text-[10px]  font-bold text-primary">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-2.5 p-2.5">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={onClose}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-soft"
                    >
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={onClose}
                          className="line-clamp-2 text-xs font-bold leading-tight text-foreground transition-colors hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5  text-[10px] text-muted-foreground">
                          {formatCurrency(item.unitPrice)} each
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex h-6 items-center rounded-md border border-border bg-background">
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.productId)}
                            disabled={item.quantity <= 1}
                            aria-label={`Reduce quantity of ${item.product.name}`}
                            className="grid h-6 w-6 place-items-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground disabled:opacity-30"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 border-x border-border text-center  text-xs font-bold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementQuantity(item.productId)}
                            disabled={!item.product.inStock}
                            aria-label={`Increase quantity of ${item.product.name}`}
                            className="grid h-6 w-6 place-items-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground disabled:opacity-30"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className=" text-xs font-bold text-foreground">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            aria-label={`Remove ${item.product.name}`}
                            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <SheetFooter className="flex-col gap-2.5 border-t border-border bg-card p-2.5 sm:flex-col">
              <div className="flex w-full items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Estimated Subtotal
                </span>
                <span className=" text-sm font-bold text-primary">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="grid w-full gap-1.5">
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  disabled={isSendingWhatsApp}
                  className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-[#25D366] text-xs font-semibold text-white transition-colors hover:bg-[#20BD5C] active:bg-[#1CAE54] disabled:opacity-60"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>
                    {isSendingWhatsApp ? "Opening..." : "Quick WhatsApp Quote"}
                  </span>
                </button>

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex h-8 w-full items-center justify-center gap-1 rounded-md bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <span>Review Order Cart</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <p className="text-[10px] leading-tight text-center text-muted-foreground">
                Formal Proforma Invoices & LPO orders issued upon submission.
              </p>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full border border-border bg-soft">
              <ShoppingBag size={20} className="text-primary" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Order Desk Empty
            </h3>
            <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-muted-foreground">
              Add medical equipment or lab consumables to request a quote or
              confirm availability.
            </p>
            <Link
              href="/products"
              onClick={onClose}
              className="mt-4 flex h-8 w-full items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse Equipment Catalog
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
