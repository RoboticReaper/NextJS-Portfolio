import { expect, test } from "@playwright/test";

test("section links jump instantly to content below the navbar", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("baoren-visited", "yes"));
  await page.route("**/api/{coc,spotify}", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  for (const destination of [
    { link: "View selected work", hash: "#work", content: ".section-heading" },
    { link: "Full background", hash: "#research", content: ".section-heading" },
    { link: "More about my hobbies", hash: "#hobbies", content: ".eyebrow" },
  ]) {
    await page.goto("/");
    await expect(page.getByTestId("name-intro")).toBeHidden();
    await page.getByRole("link", { name: destination.link, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${destination.hash}$`));
    const frames = await page.evaluate(async ({ hash, content }) => {
      const anchor = document.querySelector(hash)!;
      const target = anchor.matches(content)
        ? anchor
        : anchor.querySelector(content)!;
      const positions: { gap: number; scroll: number; maxScroll: number }[] = [];
      for (let frame = 0; frame < 5; frame++) {
        await new Promise(requestAnimationFrame);
        positions.push({
          gap:
            target.getBoundingClientRect().top -
            document.querySelector(".site-header")!.getBoundingClientRect().bottom,
          scroll: window.scrollY,
          maxScroll: document.documentElement.scrollHeight - innerHeight,
        });
      }
      return positions;
    }, destination);
    // The heading/eyebrow should clear the navbar without a large empty gap.
    for (const frame of frames) {
      expect(frame.gap, destination.hash).toBeGreaterThanOrEqual(12);
      expect(frame.gap, `${destination.hash}: ${JSON.stringify(frame)}`).toBeLessThanOrEqual(24);
    }
    expect(
      Math.max(...frames.map((frame) => frame.scroll)) -
        Math.min(...frames.map((frame) => frame.scroll)),
    ).toBeLessThanOrEqual(1);
    await page.reload();
    await expect(page.getByTestId("name-intro")).toBeHidden();
    const gap = await page.evaluate(({ hash, content }) => {
      const anchor = document.querySelector(hash)!;
      const target = anchor.matches(content)
        ? anchor
        : anchor.querySelector(content)!;
      return (
        target.getBoundingClientRect().top -
        document.querySelector(".site-header")!.getBoundingClientRect().bottom
      );
    }, destination);
    expect(gap, `Reload ${destination.hash}`).toBeGreaterThanOrEqual(12);
    expect(gap, `Reload ${destination.hash}`).toBeLessThanOrEqual(24);
  }
});

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
