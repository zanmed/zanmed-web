import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { DataTable } from "@/components/admin/data-table/data-table";
import {
  whatsAppOrderColumns,
  whatsAppOrderColumnMeta,
  type AdminWhatsAppOrderRow,
} from "@/components/admin/whatsapp-orders/columns";
import { getAllWhatsAppOrdersForAdmin } from "@/lib/data/whatsapp-orders";

export const instant = false;

export default async function AdminWhatsAppOrdersPage() {
  const orders = await getAllWhatsAppOrdersForAdmin();

  const rows: (AdminWhatsAppOrderRow & { searchText: string })[] = orders.map(
    (order) => ({
      id: order.id,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalEstimate: order.totalEstimate ? Number(order.totalEstimate) : null,
      source: order.source,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        product: { name: item.product.name },
        quantity: item.quantity,
      })),
      searchText: `${order.customerName ?? ""} ${order.customerPhone ?? ""}`,
    }),
  );

  const pendingCount = rows.filter((r) => r.status === "CLICKED").length;

  return (
    <AdminPageFrame
      eyebrow="Sales"
      title="WhatsApp orders"
      description={`${pendingCount} lead${pendingCount === 1 ? "" : "s"} awaiting follow-up.`}
    >
      <DataTable
        columns={whatsAppOrderColumns}
        data={rows}
        columnMeta={whatsAppOrderColumnMeta}
        searchPlaceholder="Search by customer name or phone…"
        title="All orders"
        description={`${rows.length} total`}
        emptyMessage="No WhatsApp orders yet."
      />
    </AdminPageFrame>
  );
}
