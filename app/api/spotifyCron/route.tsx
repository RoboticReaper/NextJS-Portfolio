import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { fetchSpotifyTracks, integrationFailure } from "@/lib/integrations";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("Authorization");
  const expected = `Bearer ${secret}`;
  if (
    !secret ||
    !authorization ||
    Buffer.byteLength(authorization) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const songs = await fetchSpotifyTracks();
    // Mark stale while preserving the last good result during background refresh.
    revalidateTag("spotify-tracks", "max");
    return Response.json(
      { message: "success", count: songs.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return integrationFailure(error);
  }
}
