import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { DataTable } from "@/components/admin/data-table/data-table";
import {
  heroSlideColumns,
  heroSlideColumnMeta,
  type AdminHeroSlideRow,
} from "@/components/admin/hero-slide/columns";
import { HeroSlidePopoverForm } from "@/components/admin/hero-slide/hero-slide-popover";
import { getAllHeroSlidesForAdmin } from "@/lib/data/hero-slides";

export const instant = false;

export default async function AdminHeroSlidesPage() {
  const slides = await getAllHeroSlidesForAdmin();

  const rows: (AdminHeroSlideRow & { searchText: string })[] = slides.map(
    (slide) => ({
      ...slide,
      searchText: `${slide.title} ${slide.accent} ${slide.eyebrow}`,
    }),
  );

  return (
    <AdminPageFrame
      eyebrow="Content"
      title="Hero slides"
      description="Manage the homepage hero carousel."
      action={<HeroSlidePopoverForm mode="create" />}
    >
      <DataTable
        columns={heroSlideColumns}
        data={rows}
        columnMeta={heroSlideColumnMeta}
        searchPlaceholder="Search slides…"
        title="All slides"
        description={`${rows.length} total`}
        emptyMessage="No slides yet."
      />
    </AdminPageFrame>
  );
}
