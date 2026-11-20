import { connection } from "next/server";
import { AdminShell } from "@/components/admin/features/admin-shell";
import { requireDashboardUser } from "@/lib/auth/require-dashboard-user";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const { session, role } = await requireDashboardUser();
  const firstName = session.user.name?.split(" ")[0];

  return (
    <AdminShell userName={firstName} role={role}>
      {children}
    </AdminShell>
  );
}
