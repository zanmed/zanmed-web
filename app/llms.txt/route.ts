import { getLlmsData } from "@/lib/data/llms";
import { buildLlmsTxt, llmsHeaders } from "@/lib/llms-builders";

export async function GET() {
  const data = await getLlmsData(false);

  return new Response(buildLlmsTxt(data), {
    headers: llmsHeaders("text/plain; charset=utf-8"),
  });
}
