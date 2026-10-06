import { getClashPlayer, integrationFailure } from "@/lib/integrations";
export const dynamic = "force-dynamic";
export async function GET(_request?: Request) {
  try {
    return Response.json(await getClashPlayer(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return integrationFailure(error);
  }
}
