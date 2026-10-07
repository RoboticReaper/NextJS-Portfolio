import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, writeFile, chmod } from "node:fs/promises";

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } =
  process.env;
if (!clientId || !clientSecret)
  throw new Error(
    "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.",
  );
const redirect = "http://127.0.0.1:8888/callback";
const state = randomBytes(32).toString("hex");
const authorization = new URL("https://accounts.spotify.com/authorize");
authorization.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirect,
  scope: "user-top-read",
  state,
  show_dialog: "true",
}).toString();
const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://127.0.0.1:8888");
  if (url.pathname === "/") {
    response.writeHead(302, { Location: authorization.href });
    response.end();
    return;
  }
  if (url.pathname !== "/callback") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const received = url.searchParams.get("state") || "";
  if (
    Buffer.byteLength(received) !== Buffer.byteLength(state) ||
    !timingSafeEqual(Buffer.from(received), Buffer.from(state))
  ) {
    response.writeHead(400);
    response.end("Invalid state. Restart authorization.");
    return;
  }
  if (url.searchParams.has("error") || !url.searchParams.get("code")) {
    response.writeHead(400);
    response.end("Authorization was not completed. Restart when ready.");
    return;
  }
  try {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: url.searchParams.get("code"),
        redirect_uri: redirect,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const token = await result.json();
    if (
      !result.ok ||
      typeof token.refresh_token !== "string" ||
      !token.scope?.split(" ").includes("user-top-read")
    )
      throw new Error("Spotify did not grant the required access.");
    const current = await readFile(".env", "utf8");
    const line = `SPOTIFY_REFRESH_TOKEN=${JSON.stringify(token.refresh_token)}`;
    const updated = /^\s*SPOTIFY_REFRESH_TOKEN\s*=.*$/m.test(current)
      ? current.replace(/^\s*SPOTIFY_REFRESH_TOKEN\s*=.*$/m, () => line)
      : `${current.trimEnd()}\n${line}\n`;
    await writeFile(".env", updated, { mode: 0o600 });
    await chmod(".env", 0o600);
    response.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(
      "Spotify reconnected. The refresh token was saved locally to .env. You can close this tab. Update SPOTIFY_REFRESH_TOKEN in your Vercel development/preview environment as well.",
    );
    console.log(
      "Spotify reconnected. Local .env updated; no token was printed. Run npm run check:integrations to verify.",
    );
    server.close();
    clearTimeout(deadline);
  } catch {
    response.writeHead(502);
    response.end(
      "Could not complete authorization. Check the app redirect URI and try again. No credentials were changed.",
    );
  }
});
const deadline = setTimeout(() => {
  console.log(
    "Authorization timed out after 10 minutes. Run the command again when ready.",
  );
  server.close();
}, 600000);
server.listen(8888, "127.0.0.1", () =>
  console.log(
    `Add ${redirect} as an exact redirect URI in your Spotify app, then open http://127.0.0.1:8888. Waiting for authorization…`,
  ),
);
server.on("error", () => {
  clearTimeout(deadline);
  console.error(
    "Could not start localhost authorization. Port 8888 may already be in use.",
  );
  process.exitCode = 1;
});
