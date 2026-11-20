import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist_Mono, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { JsonLdScripts } from "@/components/seo/json-ld-scripts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import {
  DEFAULT_OG_IMAGE,
  SITE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/constants";
import { Suspense } from "react";
import DisableDevTools from "@/lib/disable-devtools-shortcuts";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
});
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Zanmed Medical Supplies Ltd",
    "medical supplies Kenya",
    "hospital equipment Nairobi",
    "laboratory reagents Kenya",
    "diagnostic equipment Nairobi",
    "ultrasound machines Kenya",
    "patient monitors Nairobi",
    "surgical instruments Kenya",
    "hospital furniture Nairobi",
    "medical consumables Kenya",
    "PPE supplier Nairobi",
    "medical equipment suppliers in Kenya",
    "hospital procurement Nairobi",
    "ISO certified medical equipment Kenya",
    "medical devices Kenya",
    "diabetes devices Kenya",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "uVTO1EJ8kDPY-36foRhajmBFQVJhetRnjd5GaBhuUVQ",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE.siteUrl,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Hospital & Laboratory Equipment Kenya`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "medical equipment",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0284c7",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("bg-background", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <Suspense fallback={null}>
          <JsonLdScripts />
        </Suspense>
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} ${mono.variable} antialiased`}
      >
        <DisableDevTools />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
