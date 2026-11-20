import { getLlmsData } from "@/lib/data/llms";
import { buildLlmsFullTxt, llmsHeaders } from "@/lib/llms-builders";

export async function GET() {
  const data = await getLlmsData(true);

  return new Response(buildLlmsFullTxt(data), {
    headers: llmsHeaders("text/plain; charset=utf-8"),
  });
}
