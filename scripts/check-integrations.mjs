const base = process.env.INTEGRATION_BASE_URL || "http://127.0.0.1:3000";
let failed = false;
for (const endpoint of ["coc", "spotify"]) {
  try {
    const response = await fetch(new URL(`/api/${endpoint}`, base), {
      signal: AbortSignal.timeout(20000),
    });
    const body = await response.json();
    const valid =
      endpoint === "coc"
        ? typeof body.name === "string" &&
          typeof body.townHallLevel === "number" &&
          typeof body.trophies === "number" &&
          typeof body.league?.name === "string"
        : Array.isArray(body.rows) &&
          body.rows.every(
            (song) =>
              typeof song.name === "string" &&
              typeof song.artist === "string" &&
              typeof song.link === "string",
          );
    if (!response.ok || !valid) {
      console.error(
        `${endpoint}: failed (HTTP ${response.status}, ${body.code || "INVALID_RESPONSE"})`,
      );
      failed = true;
    } else console.log(`${endpoint}: healthy (HTTP ${response.status})`);
  } catch {
    console.error(
      `${endpoint}: could not reach integration. Start the site and check configuration.`,
    );
    failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
