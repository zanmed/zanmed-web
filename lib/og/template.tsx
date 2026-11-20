import { SITE } from "@/lib/constants";
import { loadInterFont, loadHeadingFont } from "./fonts";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// Design Theme CSS Variables
const DEEP_GREEN = "#1c3a28"; // --green / --brand
const GREEN_ACCENT = "#2a6341"; // --green-accent
const GOLD_ACCENT = "#c59b27"; // --gold
const SOFT_BG = "#f4f7f5"; // --soft
const PAPER = "#ffffff"; // --paper
const TEXT_MUTED = "#526058";

export interface RenderBrandedOgImageOptions {
  headline?: string;
  subline?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  location?: string;
  websiteUrl?: string;
  categoryImages?: Array<{ title: string; imageUrl: string }>;
}

const DEFAULT_CATEGORY_IMAGES = [
  {
    title: "Laboratory",
    imageUrl:
      "https://ik.imagekit.io/zanmed001/zanmed/cx-23-olympus-main_ILDLi-PmO.avif",
  },
  {
    title: "Monitors",
    imageUrl:
      "https://ik.imagekit.io/zanmed001/zanmed/image-005_k9Zbx4-Ji.webp",
  },
  {
    title: "Reagents",
    imageUrl:
      "https://ik.imagekit.io/zanmed001/zanmed/blood-grouping_vS9OPNJdD.jpeg",
  },
  {
    title: "Furniture",
    imageUrl:
      "https://ik.imagekit.io/zanmed001/zanmed/2crankmanualhospitalbed_Vx5CNZovM.webp",
  },
];

export async function renderBrandedOgImage({
  headline = "Quality Supplies.\nTrusted Care.",
  subline = SITE.tagline,
  logoUrl = "https://ik.imagekit.io/zanmed001/zanmed/logo/facebook%20profile.png",
  phone = SITE.phone,
  email = SITE.email,
  location = SITE.address,
  websiteUrl = SITE.siteUrl.replace(/^https?:\/\//, ""),
  categoryImages = DEFAULT_CATEGORY_IMAGES,
}: RenderBrandedOgImageOptions = {}) {
  // Load clean, crisp human-designed web fonts (Inter Bold + Medium)
  const fontDataBold = await loadHeadingFont();
  const fontDataRegular = await loadInterFont();

  const element = (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: PAPER,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* LEFT PANEL: Branding, Value Prop & Direct Contacts (58% Width) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "58%",
          height: "100%",
          padding: "44px 50px",
          backgroundColor: PAPER,
          borderRight: `2px solid ${SOFT_BG}`,
        }}
      >
        {/* Prominent Site Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={`${SITE.name} Logo`}
            width={340}
            height={100}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
        </div>

        {/* Clean, Modern Medical Typography */}
        <div
          style={{ display: "flex", flexDirection: "column", margin: "12px 0" }}
        >
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 46,
              lineHeight: 1.12,
              fontWeight: 800,
              color: DEEP_GREEN,
              letterSpacing: "-0.02em",
              whiteSpace: "pre-line",
            }}
          >
            {headline}
          </span>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 15,
              lineHeight: 1.4,
              color: GREEN_ACCENT,
              marginTop: 12,
              fontWeight: 600,
            }}
          >
            {subline}
          </span>
        </div>

        {/* Institutional Trust Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: DEEP_GREEN,
              color: PAPER,
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            PPB REGISTERED
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: SOFT_BG,
              color: DEEP_GREEN,
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            LPOS & QUOTATIONS
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: SOFT_BG,
              color: DEEP_GREEN,
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            47 COUNTIES
          </div>
        </div>

        {/* Contact Details & Website Link Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            paddingTop: 16,
            borderTop: `1px solid ${SOFT_BG}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              fontWeight: 600,
              color: TEXT_MUTED,
            }}
          >
            <span>Tel: {phone}</span>
            <span>Email: {email}</span>
            <span>Loc: {location}</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 700,
              color: DEEP_GREEN,
              letterSpacing: 0.5,
              marginTop: 2,
            }}
          >
            {websiteUrl}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Product Category Grid (42% Width) */}
      <div
        style={{
          display: "flex",
          width: "42%",
          height: "100%",
          position: "relative",
          backgroundColor: DEEP_GREEN,
        }}
      >
        {categoryImages.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              width: "25%",
              height: "100%",
              borderLeft:
                idx > 0 ? "1px solid rgba(255, 255, 255, 0.25)" : "none",
              overflow: "hidden",
            }}
          >
            {/* Category Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              width={200}
              height={630}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Gradient Mask for Category Labels */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage:
                  "linear-gradient(to top, rgba(28, 58, 40, 0.98) 0%, rgba(28, 58, 40, 0.15) 50%)",
              }}
            />

            {/* Category Title Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                padding: "14px 2px",
                width: "100%",
                backgroundColor: "rgba(28, 58, 40, 0.9)",
                borderTop: `2px solid ${GOLD_ACCENT}`,
              }}
            >
              <span
                style={{
                  color: PAPER,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return {
    element,
    fonts: [
      {
        name: "Inter",
        data: fontDataBold,
        weight: 800 as const,
        style: "normal" as const,
      },
      {
        name: "Inter",
        data: fontDataRegular,
        weight: 600 as const,
        style: "normal" as const,
      },
    ],
  };
}
