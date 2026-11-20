import { Globe } from "lucide-react";
import type { DashboardStat } from "@/lib/types";

import { getWebsiteVisits } from "./analytics";

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const [visits] = await Promise.all([getWebsiteVisits(30)]);

  return [
    {
      id: "website-visits",
      label: "Website visits",
      value: visits.visits.toLocaleString(),
      trend: visits.trendLabel,
      icon: Globe,
    },
  ];
}
