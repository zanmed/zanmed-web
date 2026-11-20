import { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/site/header/navbar";
import Benefits from "@/components/site/Benefits";
import { Footer } from "@/components/site/Footer";
import { headers } from "next/headers";
import { Suspense } from "react";
import { SITE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { WhatsAppChat } from "@/components/site/whatsapp-chat";
import { CookieBanner } from "@/components/site/cookie-banner";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Hospital Equipment, Laboratory Reagents & Medical Supplies Kenya`,
  description:
    "Source ISO-certified medical equipment, hospital furniture, diagnostic machinery, and lab consumables across Kenya. Direct sales, LPO orders, and fast delivery by Zanmed Medical Supplies Ltd.",
  keywords: [
    "Zanmed Medical Supplies Ltd",
    "medical equipment Kenya",
    "hospital machinery Nairobi",
    "laboratory supplies Kenya",
    "diagnostic equipment Kenya",
    "ultrasound machines Nairobi",
    "medical procurement Kenya",
  ],
  openGraph: {
    title: `${SITE_NAME} — Certified Medical & Hospital Supplies in Kenya`,
    description: SITE_DESCRIPTION,
    url: SITE.siteUrl,
    siteName: SITE_NAME,
    locale: "en_KE",
    type: "website",
  },
  alternates: {
    canonical: SITE.siteUrl,
  },
};

async function Gtm() {
  const nonce = (await headers()).get("x-nonce") ?? "";
  return <GoogleTagManager gtmId="GTM-KTHTBXBB" nonce={nonce} />;
}

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={null}>
        <Gtm />
      </Suspense>
      <GoogleAnalytics gaId="389823735" />
      <Navbar />
      {children}
      <Benefits />
      <Suspense fallback={null}>
        <WhatsAppChat />
      </Suspense>
      <CookieBanner />
      <Footer />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
