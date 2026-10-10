import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/{coc,spotify}", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
});

test("home experience previews open the matching About entry", async ({
  page,
}) => {
  for (const entry of [
    { organization: "HCESC-XR Lab, UIUC", id: "hcesc-xr" },
    { organization: "Mass General Brigham", id: "mass-general-brigham" },
    { organization: "NOBE, Illinois Chapter", id: "nobe" },
  ]) {
    await page.goto("/");
    await page
      .getByRole("heading", { name: entry.organization })
      .getByRole("link")
      .click({ timeout: 5000 });
    await expect(page).toHaveURL(new RegExp(`/about#${entry.id}$`));
    await expect(page.locator(`#${entry.id}`)).toBeInViewport();
    const clearance = await page.locator(`#${entry.id}`).evaluate(
      (element) =>
        element.getBoundingClientRect().top -
        document.querySelector(".site-header")!.getBoundingClientRect().bottom,
    );
    expect(clearance).toBeGreaterThanOrEqual(12);
    expect(clearance).toBeLessThanOrEqual(24);
  }
  await page.goto("/");
  await page.getByRole("link", { name: "All skills", exact: true }).click();
  await expect(page).toHaveURL(/\/about#technical-skills$/);
  await expect(page.locator("#technical-skills")).toBeInViewport();
  await expect(page.locator(".technical-skills")).toContainText("Isaac Sim");
  await expect(page.locator(".about-education")).toContainText("3.92");
  await expect(page.locator(".about-education")).toContainText("Database Systems");
  await expect(page.locator("#awards")).toContainText("Fall CTF");
});

test("home project previews distinguish project details from the live app", async ({
  page,
}) => {
  for (const project of [
    { name: "OtherWise", path: "/projects/otherwise", link: "Explore OtherWise" },
    { name: "RideList", path: "/projects/ridelist", link: "Open RideList" },
  ]) {
    await page.goto("/");
    await page
      .getByRole("link", {
        name: `Project details for ${project.name}`,
        exact: true,
      })
      .click({ timeout: 5000 });
    await expect(page).toHaveURL(new RegExp(`${project.path}$`));
    await expect(
      page.getByRole("heading", { name: project.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: project.link }),
    ).toHaveAttribute("target", "_blank");
  }
});

test("the home music card opens the full song list by pointer and keyboard", async ({ page }) => {
  await page.route("**/api/spotify", (route) => route.fulfill({
    json: { rows: Array.from({ length: 10 }, (_, i) => ({
      name: `Song ${i + 1}`,
      artist: "Test artist",
      image: null,
      link: `https://open.spotify.com/track/test${i + 1}`,
    })) },
  }));
  for (const keyboard of [false, true]) {
    await page.goto("/");
    const card = page.getByRole("region", { name: "On repeat" });
    await expect(card.locator(".track-list li")).toHaveCount(3);
    await expect(card.locator('a[href^="https://open.spotify.com"]')).toHaveCount(0);
    await expect(card).not.toContainText("↗");
    const link = card.getByRole("link", { name: "View all top songs" });
    if (keyboard) {
      await link.focus();
      await page.keyboard.press("Enter");
    } else {
      // Click through the stretched card link at a song's visible coordinates.
      const song = card.getByText("Song 2", { exact: true });
      await song.scrollIntoViewIfNeeded();
      const bounds = (await song.boundingBox())!;
      const x = bounds.x + bounds.width / 2;
      const y = bounds.y + bounds.height / 2;
      if (test.info().project.use.hasTouch)
        await page.touchscreen.tap(x, y);
      else await page.mouse.click(x, y);
    }
    await expect(page).toHaveURL(/\/about#music$/);
    const songs = page.getByRole("region", { name: "On repeat" });
    await expect(songs.locator(".track-list li")).toHaveCount(10);
    await expect(songs.getByRole("link", { name: /Song 10/ })).toHaveAttribute("href", "https://open.spotify.com/track/test10");
    await expect.poll(() => songs.evaluate((element) =>
      element.getBoundingClientRect().top - document.querySelector(".site-header")!.getBoundingClientRect().bottom))
      .toBeGreaterThanOrEqual(12);
    await expect.poll(() => songs.evaluate((element) =>
      element.getBoundingClientRect().top - document.querySelector(".site-header")!.getBoundingClientRect().bottom))
      .toBeLessThanOrEqual(24);
  }
});
