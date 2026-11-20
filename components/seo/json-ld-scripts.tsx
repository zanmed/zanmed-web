import { headers } from "next/headers";
import {
  SITE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { DEFAULT_OG_IMAGE } from "@/lib/constants";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  "@id": `${SITE.siteUrl}/#organization`,
  name: SITE.name,
  url: SITE.siteUrl,
  logo: `${SITE.siteUrl}/logo.avif`,
  image: `${SITE.siteUrl}${DEFAULT_OG_IMAGE}`,
  description: SITE_DESCRIPTION,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "sales",
      areaServed: "KE",
      availableLanguage: ["en", "sw"],
      url: `https://wa.me/${SITE.whatsappNumber}`,
    },
  ],
  sameAs: Object.values(SOCIAL_LINKS),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.siteUrl}/#website`,
  url: SITE.siteUrl,
  name: SITE_NAME,
  publisher: { "@id": `${SITE.siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export async function JsonLdScripts() {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <>
      <script
        id="organization-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
        suppressHydrationWarning
      />
      <script
        id="website-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        suppressHydrationWarning
      />
    </>
  );
}
