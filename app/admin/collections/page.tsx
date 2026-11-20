import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { DataTable } from "@/components/admin/data-table/data-table";
import { getAllCollectionsForAdmin } from "@/lib/data/collections";
import {
  AdminCollectionRow,
  collectionColumnMeta,
  collectionColumns,
} from "@/components/admin/collections/columns";
import { CollectionPopoverForm } from "@/components/admin/collections/collection-popover";

export const instant = false;

export default async function AdminCollectionsPage() {
  const collections = await getAllCollectionsForAdmin();

  const rows: (AdminCollectionRow & { searchText: string })[] = collections.map(
    (collection) => ({
      id: collection.id,
      slug: collection.slug,
      name: collection.name,
      coverImage: collection.coverImage,
      description: collection.description,
      productCount: collection._count.products,
      searchText: `${collection.name} ${collection.slug}`,
    }),
  );

  return (
    <AdminPageFrame
      eyebrow="Content"
      title="Collections"
      description="Manage your collections."
      action={<CollectionPopoverForm mode="create" />}
    >
      <DataTable
        columns={collectionColumns}
        data={rows}
        columnMeta={collectionColumnMeta}
        searchPlaceholder="Search collections…"
        title="All collections"
        description={`${rows.length} total`}
        emptyMessage="No collections yet."
      />
    </AdminPageFrame>
  );
}
