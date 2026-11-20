import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin", "/api", "/cart"],
      },
    ],
    sitemap: `${SITE.siteUrl}/sitemap.xml`,
  };
}
