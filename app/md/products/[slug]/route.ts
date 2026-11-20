import { getLlmsProduct } from "@/lib/data/llms";
import { buildProductMarkdown, llmsHeaders } from "@/lib/llms-builders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getLlmsProduct(slug);

  if (!product) {
    return new Response("Product not found.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  return new Response(buildProductMarkdown(product), {
    headers: llmsHeaders("text/markdown; charset=utf-8"),
  });
}
