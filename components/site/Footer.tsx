import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { SITE, SOCIAL_LINKS, footerLinks } from "@/lib/constants";
import { getTopLevelCategories } from "@/lib/data/categories";
import { getFooterCollections } from "@/lib/data/collections";

export async function Footer() {
  "use cache";
  const [categories, collections] = await Promise.all([
    getTopLevelCategories(),
    getFooterCollections({ limit: 5 }),
  ]);

  return (
    <footer className="w-full font-sans text-foreground bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 text-xs">
          <nav aria-label="Shop Categories">
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
              Shop Categories
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    prefetch={false}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className="transition-colors hover:text-primary text-[11px]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Collections">
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
              Collections
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <Link
                    prefetch={false}
                    href={`/products?collection=${encodeURIComponent(collection.slug)}`}
                    className="transition-colors hover:text-primary text-[11px]"
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              {footerLinks.Company.map(([label, href]) => (
                <li key={href}>
                  <Link
                    prefetch={false}
                    href={href}
                    className="transition-colors hover:text-primary text-[11px]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <div className="space-y-2 text-[11px] text-muted-foreground">
              {SITE.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <Link
                    prefetch={false}
                    href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-primary font-semibold font-mono"
                  >
                    {SITE.phone}
                  </Link>
                </div>
              )}
              {SITE.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <Link
                    prefetch={false}
                    href={`mailto:${SITE.email}`}
                    className="transition-colors hover:text-primary truncate"
                  >
                    {SITE.email}
                  </Link>
                </div>
              )}
              {SITE.address && (
                <div className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="leading-snug">{SITE.address}</span>
                </div>
              )}
            </div>

            <div className="mt-3.5 flex items-center gap-3 text-foreground">
              {SOCIAL_LINKS.facebook && (
                <Link
                  prefetch={false}
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="transition-colors hover:text-primary"
                >
                  <FaFacebook size={14} />
                </Link>
              )}
              {SOCIAL_LINKS.instagram && (
                <Link
                  prefetch={false}
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-primary"
                >
                  <FaInstagram size={14} />
                </Link>
              )}

              {SOCIAL_LINKS.tiktok && (
                <Link
                  prefetch={false}
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="transition-colors hover:text-primary"
                >
                  <FaTiktok size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-soft">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-[11px]">
            Certified medical supplies, lab equipment & hospital machinery
            backed by manufacturer warranty.
          </p>
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span className="font-bold text-emerald-700">M-Pesa</span>
            <span className="font-extrabold italic tracking-tighter text-[#1A1F71]">
              VISA
            </span>
            <span className="flex items-center" aria-label="Mastercard">
              <span className="h-3 w-3 rounded-full bg-[#EB001B] opacity-90" />
              <span className="-ml-1 h-3 w-3 rounded-full bg-[#F79E1B] opacity-90" />
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-[10px] font-medium text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            Copyright &copy; {new Date().getFullYear()} {SITE.name}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              prefetch={false}
              href="/privacy"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              prefetch={false}
              href="/terms"
              className="transition-colors hover:text-primary"
            >
              Terms &amp; Conditions
            </Link>
            <span>·</span>
            <Link
              prefetch={false}
              href="/support"
              className="transition-colors hover:text-primary"
            >
              Support Center
            </Link>
            <span>·</span>
            <Link
              prefetch={false}
              href="/sitemap"
              className="transition-colors hover:text-primary"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
