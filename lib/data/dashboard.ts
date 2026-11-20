import { prisma } from "@/lib/prisma";
import {
  Package,
  PackageX,
  MessageCircleWarning,
  BadgeDollarSign,
  LayoutGrid,
} from "lucide-react";
import type { DashboardStat } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfPrevMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function percentTrend(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "New this month" : "No change";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}% vs last month`;
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const prevMonthStart = startOfPrevMonth(now);

  const [
    totalProducts,
    outOfStockCount,
    pendingLeads,
    confirmedThisMonth,
    confirmedPrevMonth,
    revenueThisMonthAgg,
    categoryCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { inStock: false } }),
    prisma.whatsAppOrder.count({ where: { status: "CLICKED" } }),
    prisma.whatsAppOrder.count({
      where: {
        status: { in: ["CONFIRMED", "FULFILLED"] },
        createdAt: { gte: monthStart },
      },
    }),
    prisma.whatsAppOrder.count({
      where: {
        status: { in: ["CONFIRMED", "FULFILLED"] },
        createdAt: { gte: prevMonthStart, lt: monthStart },
      },
    }),
    prisma.whatsAppOrder.aggregate({
      where: {
        status: { in: ["CONFIRMED", "FULFILLED"] },
        createdAt: { gte: monthStart },
      },
      _sum: { totalEstimate: true },
    }),
    prisma.category.count(),
  ]);

  const revenueThisMonth = Number(revenueThisMonthAgg._sum.totalEstimate ?? 0);

  return [
    {
      id: "products",
      label: "Total Products",
      value: totalProducts.toString(),
      trend: `${categoryCount} categories`,
      icon: Package,
    },
    {
      id: "out-of-stock",
      label: "Out of Stock",
      value: outOfStockCount.toString(),
      trend: outOfStockCount > 0 ? "Needs restocking" : "All items in stock",
      icon: PackageX,
    },
    {
      id: "pending-leads",
      label: "Pending WhatsApp Leads",
      value: pendingLeads.toString(),
      trend: pendingLeads > 0 ? "Awaiting follow-up" : "All caught up",
      icon: MessageCircleWarning,
    },
    {
      id: "confirmed-orders",
      label: "Confirmed Orders (Month)",
      value: confirmedThisMonth.toString(),
      trend: percentTrend(confirmedThisMonth, confirmedPrevMonth),
      icon: LayoutGrid,
    },
    {
      id: "revenue",
      label: "Est. Revenue (Month)",
      value: formatCurrency(revenueThisMonth),
      trend: "From confirmed & fulfilled orders",
      icon: BadgeDollarSign,
    },
  ];
}

export async function getRecentWhatsAppLeads(limit = 6) {
  return prisma.whatsAppOrder.findMany({
    where: { status: { in: ["CLICKED", "CONTACTED"] } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  });
}

export async function getOutOfStockProducts(limit = 6) {
  return prisma.product.findMany({
    where: { inStock: false },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      category: { select: { name: true } },
    },
  });
}
