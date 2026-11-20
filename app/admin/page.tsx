import { DashboardOverview } from "@/components/admin/dashboard/dashboard-overview";
import { requirePageAccess } from "@/lib/auth/require-page-access";
import {
  getDashboardStats,
  getRecentWhatsAppLeads,
  getOutOfStockProducts,
} from "@/lib/data/dashboard";

export const instant = false;

export default async function AdminPage() {
  await requirePageAccess({ product: ["read"] });

  const [stats, leads, outOfStockProducts] = await Promise.all([
    getDashboardStats(),
    getRecentWhatsAppLeads(),
    getOutOfStockProducts(),
  ]);

  return (
    <DashboardOverview
      stats={stats}
      leads={leads}
      outOfStockProducts={outOfStockProducts}
    />
  );
}
