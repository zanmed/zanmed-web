import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface WhatsAppLeadRow {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  status: string;
  totalEstimate: unknown;
  createdAt: Date;
  items: { product: { name: string }; quantity: number }[];
}

const STATUS_LABEL: Record<string, string> = {
  CLICKED: "Awaiting contact",
  CONTACTED: "In conversation",
};

export function WhatsAppLeadsPanel({ leads }: { leads: WhatsAppLeadRow[] }) {
  return (
    <section className="border border-border bg-white/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <h3 className="font-serif text-lg sm:text-xl">Recent WhatsApp leads</h3>
        <Link
          href="/admin/whatsapp-orders"
          className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-bronze-dark hover:text-ink"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-ink/50">
          No pending leads right now.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <MessageCircle size={16} className="shrink-0 text-ink/30" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {lead.customerName || "Unnamed lead"}
                  </p>
                  <p className="truncate text-[11px] text-ink/50">
                    {lead.items
                      .map((i) => `${i.product.name} x${i.quantity}`)
                      .join(", ")}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium">
                  {lead.totalEstimate != null
                    ? formatCurrency(Number(lead.totalEstimate))
                    : "—"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-ink/40">
                  {STATUS_LABEL[lead.status] ?? lead.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
