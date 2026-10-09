import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "../app/api/token-usage/route";
const { read } = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock("../lib/token-usage-db.mjs", () => ({ readUsage: read, USERNAME: "roboticreaper" }));
afterEach(() => read.mockReset());
describe("public token usage API", () => {
  it("returns database rows without connection details", async () => {
    read.mockResolvedValue([{ date: "2026-10-08", tokensApprox: 800_700_000, tokensDisplay: "800.7M tokens", status: "recorded", collectedAt: "2026-10-09T22:15:54Z" }]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ username: "roboticreaper", days: [{ date: "2026-10-08", tokensApprox: 800_700_000 }] });
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=300");
  });
  it("handles an empty database as an empty dataset", async () => {
    read.mockResolvedValue([]);
    expect(await (await GET()).json()).toMatchObject({ days: [] });
  });
  it("does not disclose credentials when the database fails", async () => {
    read.mockRejectedValue(new Error("postgres://private-user:private-password@private-host"));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private-");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
