import { expect, test } from "@playwright/test";

test("first visit introduction gives way to usable content and reload is fast", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("name-intro")).toBeVisible();
  await expect(page.getByTestId("name-intro")).toHaveAttribute(
    "data-visit",
    "first",
  );
  await expect(page.getByTestId("name-intro")).toBeHidden({ timeout: 5000 });
  await expect(
    page.getByRole("heading", { name: "Baoren Liu", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("name-intro")).toHaveAttribute(
    "data-visit",
    "return",
  );
  await expect(page.getByTestId("name-intro")).toBeHidden({ timeout: 1500 });
});

test("theme survives reload and navigation works at every viewport", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");
  await expect(page.getByTestId("name-intro")).toBeHidden();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Built with purpose." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Read the LHS Schedule story" }).click();
  await expect(
    page.getByRole("heading", { name: /Building the LHS Schedule App/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("integration failures remain usable and retry recovers", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/coc", (route) =>
    route.fulfill({ status: 502, json: { error: "Temporarily unavailable" } }),
  );
  await page.route("**/api/spotify", (route) =>
    route.fulfill({ status: 502, json: { error: "Temporarily unavailable" } }),
  );
  await page.goto("/about");
  const clash = page.getByRole("region", { name: "Clash of Clans" });
  const spotify = page.getByRole("region", { name: "On repeat" });
  await expect(clash.getByText("Temporarily unavailable")).toBeVisible();
  await expect(spotify.getByText("Temporarily unavailable")).toBeVisible();
  await page.route("**/api/coc", (route) =>
    route.fulfill({
      json: {
        name: "Baoren",
        townHallLevel: 15,
        trophies: 2200,
        league: { name: "Unranked", iconUrls: { small: "/coc_unranked.png" } },
      },
    }),
  );
  await clash.getByRole("button", { name: "Try again" }).click();
  await expect(clash.getByText("2,200")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("content is available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Baoren Liu", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View selected work" }),
  ).toBeVisible();
  await context.close();
});

test("blocked browser storage still allows intro completion and theme switching", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.getByTestId("name-intro")).toBeHidden({ timeout: 5000 });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("project story still offers the live application", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/lhsschedule");
  await expect(
    page.getByRole("link", { name: "Open LHS Schedule" }),
  ).toHaveAttribute("href", "https://lhsschedule.netlify.app/");
});

test("a slow successful integration is given the full server request budget", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/coc", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.route("**/api/spotify", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 12500));
    await route.fulfill({
      json: {
        rows: [
          {
            name: "Slow song",
            artist: "Artist",
            image: null,
            link: "https://open.spotify.com/track/test",
          },
        ],
      },
    });
  });
  await page.goto("/about");
  await expect(
    page.getByRole("region", { name: "On repeat" }).getByText("Slow song"),
  ).toBeVisible({ timeout: 17000 });
});
