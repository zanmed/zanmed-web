import { categoryIcons } from "@/lib/constants";
import Header from "./header";
import { getTopLevelCategories } from "@/lib/data/categories";
import { getSearchIndex, getSearchScopes } from "@/lib/data/search";
import { MdLaptopChromebook } from "react-icons/md";

export default async function Navbar() {
  const [categories, searchIndex, searchScopes] = await Promise.all([
    getTopLevelCategories(),
    getSearchIndex(),
    getSearchScopes(),
  ]);

  const CATEGORY_LINKS = categories.map((category) => {
    const Icon =
      categoryIcons[category.slug as keyof typeof categoryIcons] ??
      MdLaptopChromebook;

    return {
      label: category.name,
      href: `/products?category=${category.slug}`,
      icon: <Icon size={15} />,
    };
  });

  return (
    <Header
      CATEGORY_LINKS={CATEGORY_LINKS}
      SEARCH_INDEX={searchIndex}
      SEARCH_SCOPES={searchScopes}
    />
  );
}
