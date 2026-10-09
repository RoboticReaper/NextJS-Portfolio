import { expect, test } from "@playwright/test";
import snapshot from "../../public/data/codex-activity.json";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-09T22:00:00Z"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/{coc,spotify}", (route) => route.fulfill({ status: 503, json: { error: "Unavailable" } }));
  await page.route("**/api/token-usage", (route) => route.fulfill({ json: { username: "roboticreaper", precision: "source-rounded", updatedAt: snapshot.fetchedAt, days: snapshot.days } }));
});

test("database activity displays real totals and changes aggregation", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Token activity", exact: true });
  await expect(section.getByRole("button", { name: "Daily", exact: true })).toHaveAttribute("aria-pressed", "true");
  const day = section.locator('[data-date="2026-10-08"]');
  await expect(section.locator('a[href*="chatgpt.com/u/"]')).toHaveCount(0);
  await day.hover();
  await expect(page.getByRole("tooltip")).toContainText("800.7M tokens");
  await expect(page.getByRole("tooltip")).toContainText("Oct 8, 2026");
  await day.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await day.click();
  if ((page.viewportSize()?.width ?? 1280) <= 700) {
    const bounds = await day.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(24);
    expect(bounds?.height).toBeGreaterThanOrEqual(24);
  }
  await expect(section.getByRole("status")).toContainText("800.7M tokens");
  await section.getByRole("button", { name: "Weekly", exact: true }).click();
  await expect(section.locator(".token-grid .token-cell")).toHaveCount(52);
  await section.locator(".token-grid .token-cell").last().click();
  await expect(section.getByRole("status")).toContainText("2B tokens");
  await section.getByRole("button", { name: "Cumulative", exact: true }).click();
  await section.locator('[data-date="2026-10-09"]').focus();
  await expect(section.getByRole("status")).toContainText("3.8B tokens");
  await section.getByRole("button", { name: "Daily", exact: true }).click();
  await section.locator('[data-date="2026-10-08"]').focus();
  await page.keyboard.press("ArrowUp");
  await expect(section.getByRole("status")).toContainText("98.3M tokens");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(section).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("database failure offers a retry that recovers", async ({ page }) => {
  await page.route("**/api/token-usage", (route) => route.fulfill({ status: 503, json: { error: "Token activity is temporarily unavailable." } }));
  await page.goto("/");
  const section = page.getByRole("region", { name: "Token activity", exact: true });
  await expect(section).toContainText("temporarily unavailable");
  await page.route("**/api/token-usage", (route) => route.fulfill({ json: { days: snapshot.days, updatedAt: snapshot.fetchedAt } }));
  await section.getByRole("button", { name: "Try again" }).click();
  await expect(section.locator('[data-date="2026-10-08"]')).toBeVisible();
});

test("an empty database is not presented as zero usage", async ({ page }) => {
  await page.route("**/api/token-usage", (route) => route.fulfill({ json: { days: [], updatedAt: null } }));
  await page.goto("/");
  const section = page.getByRole("region", { name: "Token activity", exact: true });
  await expect(section).toContainText("No activity has been synced yet");
  await expect(section.locator(".token-cell")).toHaveCount(0);
});
