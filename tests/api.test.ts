import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as coc } from "../app/api/coc/route";
import { GET as spotify } from "../app/api/spotify/route";
import { GET as cron } from "../app/api/spotifyCron/route";

vi.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
  revalidateTag: vi.fn(),
}));
const fetchMock = vi.fn<typeof fetch>();
const req = (path: string, authorization?: string) =>
  new Request(`http://localhost/api/${path}`, {
    headers: authorization ? { Authorization: authorization } : {},
  });
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status });
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("COC_API_KEY", "test-coc-secret");
  vi.stubEnv("SPOTIFY_CLIENT_ID", "test-client");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test-secret");
  vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test-refresh");
  vi.stubEnv("CRON_SECRET", "test-cron");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("Clash of Clans route", () => {
  it("renders a real unranked player without treating missing league as an API failure", async () => {
    fetchMock.mockResolvedValue(
      json({
        name: "Baoren",
        tag: "#LY8L20QQR",
        townHallLevel: 15,
        trophies: 2000,
      }),
    );
    const response = await coc(req("coc"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      name: "Baoren",
      league: { name: "Unranked", iconUrls: { small: "/coc_unranked.png" } },
    });
  });
  it("does not send an undefined credential upstream", async () => {
    vi.stubEnv("COC_API_KEY", "");
    const response = await coc(req("coc"));
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects upstream authentication errors instead of returning fake player data", async () => {
    fetchMock.mockResolvedValue(
      json({ reason: "accessDenied", message: "secret detail" }, 403),
    );
    const response = await coc(req("coc"));
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("secret detail");
  });
  it.each([
    json({ name: "incomplete" }),
    new Response("<html>Maintenance</html>"),
    new Error("offline"),
  ])("handles malformed and offline responses", async (result) => {
    if (result instanceof Error) fetchMock.mockRejectedValue(result);
    else fetchMock.mockResolvedValue(result);
    const response = await coc(req("coc"));
    expect(response.status).toBe(502);
  });
  it("propagates rate-limit backoff without leaking credentials", async () => {
    fetchMock.mockResolvedValue(
      new Response("{}", { status: 429, headers: { "Retry-After": "60" } }),
    );
    const response = await coc(req("coc"));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
  });
});

describe("Spotify route", () => {
  it("refreshes authorization and returns top tracks even without the old database", async () => {
    fetchMock
      .mockResolvedValueOnce(
        json({
          access_token: "access",
          token_type: "Bearer",
          expires_in: 3600,
        }),
      )
      .mockResolvedValueOnce(
        json({
          items: [
            {
              name: "Song",
              artists: [{ name: "First" }, { name: "Second" }],
              album: { images: [{ url: "https://i.scdn.co/image/test" }] },
              external_urls: { spotify: "https://open.spotify.com/track/test" },
            },
          ],
        }),
      );
    const response = await spotify(req("spotify"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      rows: [
        {
          name: "Song",
          artist: "First, Second",
          image: "https://i.scdn.co/image/test",
          link: "https://open.spotify.com/track/test",
        },
      ],
    });
  });
  it("reports an expired refresh token without exposing it or fetching tracks", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "invalid_grant" }, 400));
    const response = await spotify(req("spotify"));
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({
      code: "SPOTIFY_REAUTH_REQUIRED",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("reports missing configuration before network requests", async () => {
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "");
    const response = await spotify(req("spotify"));
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("handles empty listening history", async () => {
    fetchMock
      .mockResolvedValueOnce(json({ access_token: "access" }))
      .mockResolvedValueOnce(json({ items: [] }));
    const response = await spotify(req("spotify"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ rows: [] });
  });
  it("accepts a track without cover art", async () => {
    fetchMock
      .mockResolvedValueOnce(json({ access_token: "access" }))
      .mockResolvedValueOnce(
        json({
          items: [
            {
              name: "Song",
              artists: [],
              album: { images: [] },
              external_urls: { spotify: "https://open.spotify.com/track/test" },
            },
          ],
        }),
      );
    const response = await spotify(req("spotify"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      rows: [{ image: null, artist: "Unknown artist" }],
    });
  });
  it("does not turn a malformed tracks response into an empty success", async () => {
    fetchMock
      .mockResolvedValueOnce(json({ access_token: "access" }))
      .mockResolvedValueOnce(json({ error: {} }));
    expect((await spotify(req("spotify"))).status).toBe(502);
  });
});

describe("Spotify cron authorization", () => {
  it("fails closed when CRON_SECRET is absent, including Bearer undefined", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await cron(req("spotifyCron", "Bearer undefined"))).status).toBe(
      401,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects an unauthorized caller without side effects", async () => {
    expect((await cron(req("spotifyCron", "Bearer wrong"))).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("returns a controlled error when an authorized refresh fails", async () => {
    fetchMock.mockResolvedValue(json({ error: "invalid_grant" }, 400));
    expect((await cron(req("spotifyCron", "Bearer test-cron"))).status).toBe(
      502,
    );
  });
});

it("successful cron refresh marks cached tracks stale without discarding the last good result", async () => {
  const { revalidateTag } = await import("next/cache");
  fetchMock
    .mockResolvedValueOnce(json({ access_token: "access" }))
    .mockResolvedValueOnce(json({ items: [] }));
  const response = await cron(req("spotifyCron", "Bearer test-cron"));
  expect(response.status).toBe(200);
  expect(revalidateTag).toHaveBeenCalledWith("spotify-tracks", "max");
});
