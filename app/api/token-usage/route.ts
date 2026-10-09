import { readUsage, USERNAME } from "@/lib/token-usage-db.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  try {
    const days = await readUsage();
    return Response.json(
      { username: USERNAME ?? "roboticreaper", source: "https://chatgpt.com/u/roboticreaper", precision: "source-rounded", updatedAt: days.length ? days.reduce((latest, row) => row.collectedAt > latest ? row.collectedAt : latest, days[0].collectedAt) : null, days },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60" } },
    );
  } catch {
    return Response.json({ error: "Token activity is temporarily unavailable. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
