import { ImageResponse } from "next/og";
import { renderBrandedOgImage, OG_IMAGE_SIZE } from "@/lib/og/template";
import { DEFAULT_BACKGROUND_IMAGE } from "@/lib/constants";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt =
  "Zanmed — Supply of all medical equipment and supplies in Kenya";

export default async function Image() {
  const { element, fonts } = await renderBrandedOgImage({
    lines: [
      { text: "Affordable technology for everyone." },
      { text: "Zanmed Medical Supplies Ltd.", accent: true },
    ],
    backgroundImage: DEFAULT_BACKGROUND_IMAGE,
  });

  return new ImageResponse(element, {
    ...size,
    fonts,
    headers: {
      "Cache-Control":
        "public, immutable, no-transform, max-age=86400, s-maxage=31536000",
    },
  });
}
