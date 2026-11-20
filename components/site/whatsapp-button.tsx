"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { logProductWhatsAppClick } from "@/lib/actions/products";

export function WhatsAppOrderButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const { url } = await logProductWhatsAppClick(productId);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      size="lg"
      className="w-full"
    >
      {isPending ? "Opening WhatsApp…" : "Order via WhatsApp"}
    </Button>
  );
}
