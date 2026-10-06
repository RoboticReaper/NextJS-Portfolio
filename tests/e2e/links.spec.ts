import { expect, test } from "@playwright/test";

test("all internal links and section shortcuts have usable destinations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/coc", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.route("**/api/spotify", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  const routes = [
    "/",
    "/about",
    "/projects",
    "/resume",
    "/projects/otherwise",
    "/projects/ridelist",
    "/projects/lhsschedule",
    "/projects/ctf",
    "/missing-page",
  ];
  const localLinks = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    for (const href of hrefs) {
      expect(href.trim()).not.toBe("");
      const target = new URL(href, page.url());
      if (target.origin === new URL(page.url()).origin)
        localLinks.add(target.href);
      else expect(["https:", "mailto:"]).toContain(target.protocol);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  for (const href of Array.from(localLinks)) {
    const target = new URL(href);
    const response = await page.request.get(href);
    if (target.pathname === "/missing-page" && target.hash === "#main-content")
      expect(response.status()).toBe(404);
    else expect(response.ok(), `Broken internal link: ${href}`).toBe(true);
    if (target.hash) {
      await page.goto(`${target.pathname}${target.search}`);
      await expect(
        page.locator(
          `[id=${JSON.stringify(decodeURIComponent(target.hash.slice(1)))}]`,
        ),
        `Missing section: ${href}`,
      ).toHaveCount(1);
    }
  }
  await page.goto("/missing-page");
  await page.getByRole("link", { name: "Back home" }).click();
  await expect(page).toHaveURL(/\/$/);
});
