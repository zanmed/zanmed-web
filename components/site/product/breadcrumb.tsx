import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProduct {
  name: string;
  category: { name: string; slug: string } | null;
}

export default function BreadcrumbBasic({
  product,
}: {
  product: BreadcrumbProduct;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {product.category && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/products?category=${product.category.slug}`}
              >
                {product.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>{product.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
