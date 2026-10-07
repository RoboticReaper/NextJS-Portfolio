import { spawn } from "node:child_process";
import { once } from "node:events";
import { expect, it } from "vitest";

it("rejects non-ASCII OAuth state without terminating the local helper", async () => {
  const child = spawn(process.execPath, ["scripts/spotify-authorize.mjs"], {
    env: {
      ...process.env,
      SPOTIFY_CLIENT_ID: "test-client",
      SPOTIFY_CLIENT_SECRET: "test-secret",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Helper did not start")),
        5000,
      );
      child.stdout.on("data", (chunk) => {
        if (String(chunk).includes("Waiting for authorization")) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.once("error", reject);
      child.once("exit", () => {
        clearTimeout(timer);
        reject(new Error("Helper exited unexpectedly"));
      });
    });
    const response = await fetch(
      `http://127.0.0.1:8888/callback?state=${encodeURIComponent("é".repeat(64))}`,
      { signal: AbortSignal.timeout(2000) },
    );
    expect(response.status).toBe(400);
    const second = await fetch("http://127.0.0.1:8888/callback?state=wrong");
    expect(second.status).toBe(400);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exit = once(child, "exit");
      child.kill();
      await exit;
    }
  }
});
