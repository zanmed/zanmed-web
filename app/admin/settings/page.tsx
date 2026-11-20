import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { requirePageAccess } from "@/lib/auth/require-page-access";

export const instant = false;

export default async function AdminSettingsPage() {
  await requirePageAccess({});

  return (
    <AdminPageFrame
      eyebrow="Settings"
      title="Settings"
      description="Manage your store settings."
    >
      <div className="grid gap-6">
        <p>Settings page content goes here.</p>
      </div>
    </AdminPageFrame>
  );
}
