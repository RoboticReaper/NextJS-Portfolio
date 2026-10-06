import { unstable_cache } from "next/cache";

export interface Song {
  name: string;
  artist: string;
  image: string | null;
  link: string;
}
export interface ClashPlayer {
  name: string;
  tag: string;
  townHallLevel: number;
  trophies: number;
  league: { name: string; iconUrls: { small: string } };
}
export class IntegrationError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 502,
    public retryAfter?: string,
  ) {
    super(message);
  }
}
function required(key: string) {
  const value = process.env[key]?.trim();
  if (!value)
    throw new IntegrationError(
      "NOT_CONFIGURED",
      "This connection is not configured yet.",
      503,
    );
  return value;
}
async function requestJson(
  url: string,
  init: RequestInit,
): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 429)
    throw new IntegrationError(
      "RATE_LIMITED",
      "Taking a short break. Please try again later.",
      429,
      response.headers.get("Retry-After") ?? "60",
    );
  const data = await response.json();
  if (!response.ok) {
    if (data?.error === "invalid_grant")
      throw new IntegrationError(
        "SPOTIFY_REAUTH_REQUIRED",
        "Spotify is waiting for account reconnection.",
      );
    if (response.status === 403)
      throw new IntegrationError(
        "ACCESS_DENIED",
        "This connection needs its permissions checked.",
      );
    throw new IntegrationError(
      "UPSTREAM_ERROR",
      "This connection is temporarily unavailable.",
    );
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new IntegrationError(
      "INVALID_RESPONSE",
      "This connection returned an unexpected response.",
    );
  return data;
}
export async function fetchClashPlayer(): Promise<ClashPlayer> {
  const key = required("COC_API_KEY");
  const tag = process.env.COC_PLAYER_TAG?.trim() || "#LY8L20QQR";
  const data = await requestJson(
    `https://cocproxy.royaleapi.dev/v1/players/${encodeURIComponent(tag)}`,
    { headers: { Authorization: `Bearer ${key}` } },
  );
  if (
    typeof data.name !== "string" ||
    typeof data.townHallLevel !== "number" ||
    typeof data.trophies !== "number"
  )
    throw new IntegrationError(
      "INVALID_RESPONSE",
      "Player details are temporarily unavailable.",
    );
  const league = data.league as ClashPlayer["league"] | undefined;
  return {
    name: data.name,
    tag: typeof data.tag === "string" ? data.tag : tag,
    townHallLevel: data.townHallLevel,
    trophies: data.trophies,
    league: {
      name: typeof league?.name === "string" ? league.name : "Unranked",
      iconUrls: {
        small:
          typeof league?.iconUrls?.small === "string"
            ? league.iconUrls.small
            : "/coc_unranked.png",
      },
    },
  };
}
function spotifyLink(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "open.spotify.com";
  } catch {
    return false;
  }
}
export async function fetchSpotifyTracks(): Promise<Song[]> {
  const clientId = required("SPOTIFY_CLIENT_ID");
  const clientSecret = required("SPOTIFY_CLIENT_SECRET");
  const refreshToken = required("SPOTIFY_REFRESH_TOKEN");
  const token = await requestJson("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });
  if (typeof token.access_token !== "string" || !token.access_token)
    throw new IntegrationError(
      "INVALID_RESPONSE",
      "Spotify authorization is temporarily unavailable.",
    );
  const data = await requestJson(
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  );
  if (!Array.isArray(data.items))
    throw new IntegrationError(
      "INVALID_RESPONSE",
      "Spotify listening history is temporarily unavailable.",
    );
  return data.items.map(
    (item: {
      name?: unknown;
      artists?: { name?: unknown }[];
      album?: { images?: { url?: unknown }[] };
      external_urls?: { spotify?: unknown };
    }) => {
      if (
        !item ||
        typeof item.name !== "string" ||
        !spotifyLink(item.external_urls?.spotify)
      )
        throw new IntegrationError(
          "INVALID_RESPONSE",
          "Spotify listening history is temporarily unavailable.",
        );
      const artists = Array.isArray(item.artists)
        ? item.artists
            .map((a) => a?.name)
            .filter((name): name is string => typeof name === "string")
        : [];
      const images = Array.isArray(item.album?.images) ? item.album.images : [];
      const image = images.find(
        (img) => typeof img?.url === "string" && img.url.startsWith("https://"),
      )?.url;
      return {
        name: item.name,
        artist: artists.join(", ") || "Unknown artist",
        image: typeof image === "string" ? image : null,
        link: item.external_urls.spotify,
      };
    },
  );
}
export const getClashPlayer = unstable_cache(
  fetchClashPlayer,
  ["clash-player-v2"],
  { revalidate: 300 },
);
export const getSpotifyTracks = unstable_cache(
  fetchSpotifyTracks,
  ["spotify-tracks-v2"],
  { revalidate: 3600, tags: ["spotify-tracks"] },
);

export function integrationFailure(error: unknown) {
  const safe =
    error instanceof IntegrationError
      ? error
      : new IntegrationError(
          "UNAVAILABLE",
          "This connection is temporarily unavailable. Please try again.",
        );
  return Response.json(
    { error: safe.message, code: safe.code },
    {
      status: safe.status,
      headers: {
        "Cache-Control": "no-store",
        ...(safe.retryAfter ? { "Retry-After": safe.retryAfter } : {}),
      },
    },
  );
}
