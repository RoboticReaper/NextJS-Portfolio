import { expect, test } from "@playwright/test";

for (const project of [
  {
    name: "OtherWise",
    path: "/projects/otherwise",
    live: "https://roboticreaper.github.io/OtherWise/",
  },
  {
    name: "RideList",
    path: "/projects/ridelist",
    live: "https://www.ridelist.app/",
  },
]) {
  test(`${project.name} has a readable case study and a live application link`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/projects");
    await page
      .getByRole("heading", { name: project.name })
      .getByRole("link")
      .click({ timeout: 5000 });
    await expect(page).toHaveURL(new RegExp(`${project.path}$`));
    await expect(
      page.getByRole("heading", { name: project.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: `Open ${project.name}` }),
    ).toHaveAttribute("href", project.live);
  });
}

test("résumé navigation opens only the document and PDF controls", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Résumé", exact: true })
    .click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(
    page.getByRole("heading", { name: "Résumé", exact: true }),
  ).toBeVisible();
  const preview = page.getByRole("img", { name: "Baoren Liu résumé" });
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Education", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Technical skills", exact: true })).toHaveCount(0);
  const download = page.getByRole("link", { name: "Download PDF" });
  const response = await page.request.get(
    (await download.getAttribute("href"))!,
  );
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  if (isMobile)
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeVisible();
});

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
  const logos = page.locator(".logo-mark");
  await expect(logos).toHaveCount(2);
  for (const logo of await logos.all())
    await expect(logo).toHaveCSS("background-color", "rgb(25, 37, 55)");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const logo of await logos.all())
    await expect(logo).toHaveCSS("background-color", "rgb(234, 240, 248)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Projects", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Project details for LHS Schedule" }).click();
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
  await page.route("**/api/spotify", (route) =>
    route.fulfill({
      json: {
        rows: [
          {
            name: "Recovered song",
            artist: "Artist",
            image: null,
            link: "https://open.spotify.com/track/test",
          },
        ],
      },
    }),
  );
  await spotify.getByRole("button", { name: "Try again" }).click();
  await expect(spotify.getByText("Recovered song")).toBeVisible();
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
