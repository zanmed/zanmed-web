import Link from "next/link";
import { Plus } from "lucide-react";
import type { DashboardStat } from "@/lib/types";
import { StatsGrid } from "./stats-grid";
import { WhatsAppLeadsPanel } from "./whatsapp-leads-panel";
import { StockAlertsPanel } from "./stock-alerts-panel";

interface DashboardOverviewProps {
  stats: DashboardStat[];
  leads: Parameters<typeof WhatsAppLeadsPanel>[0]["leads"];
  outOfStockProducts: Parameters<typeof StockAlertsPanel>[0]["products"];
}

export function DashboardOverview({
  stats,
  leads,
  outOfStockProducts,
}: DashboardOverviewProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] text-bronze-dark">
            Overview
          </p>
          <h2 className="mt-2 font-serif text-base md:text-xl lg:text-2xl">
            Your business at a glance.
          </h2>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-ink px-2 py-2 md:px-4 md:py-3 text-[10px] uppercase tracking-widest text-paper"
        >
          <Plus size={15} /> Add product
        </Link>
      </div>

      <StatsGrid stats={stats} />

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <WhatsAppLeadsPanel leads={leads} />
        <StockAlertsPanel products={outOfStockProducts} />
      </div>
    </>
  );
}
