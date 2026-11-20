// lib/og/fonts.ts

/**
 * Fetch TTF/OTF font binary data from Google Fonts compatible with Satori (@vercel/og)
 */
async function fetchGoogleFont(
  family: string,
  weight: number,
  text?: string,
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    family: `${family}:wght@${weight}`,
    ...(text ? { text } : {}),
  });

  const url = `https://fonts.googleapis.com/css2?${params.toString()}`;

  // Safari/Mac OS X 10_10 User-Agent forces Google Fonts to return TTF instead of WOFF2
  const css = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9",
    },
  }).then((res) => res.text());

  const fontUrl = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];

  if (!fontUrl) {
    throw new Error(
      `Could not resolve TTF font URL for ${family} (weight: ${weight})`,
    );
  }

  const cleanUrl = fontUrl.replace(/^["']|["']$/g, "");
  const fontResponse = await fetch(cleanUrl);

  if (!fontResponse.ok) {
    throw new Error(`Failed to download font binary from ${cleanUrl}`);
  }

  return fontResponse.arrayBuffer();
}

/**
 * Load Inter ExtraBold (800) for clean headlines
 */
export async function loadHeadingFont(text?: string): Promise<ArrayBuffer> {
  return fetchGoogleFont("Inter", 800, text);
}

/**
 * Load Inter SemiBold (600) for body copy & contact details
 */
export async function loadInterFont(text?: string): Promise<ArrayBuffer> {
  return fetchGoogleFont("Inter", 600, text);
}

/**
 * Legacy support for Cormorant Garamond
 */
export async function loadCormorantGaramond(
  text: string,
): Promise<ArrayBuffer> {
  return fetchGoogleFont("Cormorant Garamond", 600, text);
}
