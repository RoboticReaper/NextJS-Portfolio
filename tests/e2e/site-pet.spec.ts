import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/{coc,spotify}", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
});

test("Guga can be hidden and restored without losing its dropped position", async ({ page }) => {
  await page.goto("/projects");
  const pet = page.getByRole("button", { name: "Move Guga" });
  await expect(pet).toBeVisible();
  await pet.focus();
  await expect(pet).toHaveCSS("outline-style", "none");
  const before = (await pet.boundingBox())!;
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await pet.boundingBox())!.x).toBeLessThan(before.x);
  const dropped = (await pet.boundingBox())!;

  await page.getByRole("button", { name: "Hide Guga" }).click();
  await expect(pet).toHaveCount(0);
  const restore = page.getByRole("button", { name: "Show Guga" });
  await expect(restore).toBeVisible();
  const bounds = (await restore.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(bounds.x).toBeGreaterThan(viewport.width - 100);
  expect(bounds.y).toBeGreaterThan(viewport.height - 100);
  await page.reload();
  await expect(restore).toBeVisible();
  await restore.click();
  await expect(pet).toBeFocused();
  await expect(pet).toHaveCSS("outline-style", "none");
  const restored = (await pet.boundingBox())!;
  expect(restored.x).toBeCloseTo(dropped.x, 0);
  expect(restored.y).toBeCloseTo(dropped.y, 0);
});

test("dragging walks in either direction and releasing leaves Guga in place", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projects");
  await expect(page.getByTestId("name-intro")).toBeHidden();
  const pet = page.getByRole("button", { name: "Move Guga" });
  await expect(pet).toBeVisible();
  const start = (await pet.boundingBox())!;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await expect(pet).toHaveCSS("outline-style", "none");
  await page.mouse.move(start.x - 100, start.y - 80, { steps: 8 });
  await expect(pet).toHaveAttribute("data-animation", "walk-left");
  await page.mouse.move(start.x - 50, start.y - 60, { steps: 4 });
  await expect(pet).toHaveAttribute("data-animation", "walk-right");
  const dropped = (await pet.boundingBox())!;
  await page.mouse.up();
  await expect(pet).toHaveAttribute("data-animation", "rest");
  await page.mouse.move(10, 10);
  await page.mouse.wheel(0, 500);
  const afterScroll = (await pet.boundingBox())!;
  expect(afterScroll.x).toBeCloseTo(dropped.x, 0);
  expect(afterScroll.y).toBeCloseTo(dropped.y, 0);
  await page.getByRole("link", { name: "Project details for OtherWise" }).click();
  await expect(page).toHaveURL(/\/projects\/otherwise$/);
  const afterNavigation = (await pet.boundingBox())!;
  expect(afterNavigation.x).toBeCloseTo(dropped.x, 0);
  expect(afterNavigation.y).toBeCloseTo(dropped.y, 0);
});

for (const { random, delay, activity } of [
  { random: 0, delay: 2000, activity: "idle" },
  { random: 0.999, delay: 4997, activity: "wave" },
]) {
  test(`Guga rests for a randomized ${delay}ms then plays one ${activity} animation`, async ({ page }) => {
    await page.addInitScript((value) => { Math.random = () => value; }, random);
    await page.clock.install();
    await page.goto("/projects");
    const pet = page.getByRole("button", { name: "Move Guga" });
    await expect(pet).toBeVisible();
    await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(pet).toHaveAttribute("data-animation", "rest");
    const start = (await pet.boundingBox())!;
    const sprite = pet.locator("span");
    await expect(sprite).toHaveCSS("animation-name", "none");
    await page.clock.runFor(delay - 1);
    await expect(pet).toHaveAttribute("data-animation", "rest");
    await page.clock.runFor(2);
    await expect(pet).toHaveAttribute("data-animation", activity);
    await expect(sprite).toHaveCSS("animation-iteration-count", "1");
    const frame = await sprite.evaluate((element) => getComputedStyle(element).backgroundPositionX);
    await expect.poll(() => sprite.evaluate((element) => getComputedStyle(element).backgroundPositionX)).not.toBe(frame);
    await page.clock.runFor(1600);
    await expect(pet).toHaveAttribute("data-animation", "rest");
    await expect(sprite).toHaveCSS("animation-name", "none");
    expect(await pet.boundingBox()).toEqual(start);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.fastForward(60000);
    await expect(pet).toHaveAttribute("data-animation", "rest");
    await expect(sprite).toHaveCSS("animation-name", "none");
  });
}

test("dragging to screen edges and resizing keep Guga and its close button reachable", async ({ page }) => {
  await page.goto("/projects");
  const pet = page.getByRole("button", { name: "Move Guga" });
  await expect(pet).toBeVisible();
  const start = (await pet.boundingBox())!;
  const viewport = page.viewportSize()!;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(0, 0, { steps: 5 });
  let bounds = (await page.getByTestId("site-pet").boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  await page.mouse.move(viewport.width - 1, viewport.height - 1, { steps: 5 });
  await page.mouse.up();
  bounds = (await page.getByTestId("site-pet").boundingBox())!;
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
  await page.setViewportSize({ width: 320, height: 480 });
  await expect.poll(async () => {
    const resized = (await page.getByTestId("site-pet").boundingBox())!;
    return resized.x + resized.width <= 320 && resized.y + resized.height <= 480;
  }).toBe(true);
  await page.getByRole("button", { name: "Hide Guga" }).click();
  await expect(page.getByRole("button", { name: "Show Guga" })).toBeInViewport();
});

test("touch dragging moves Guga without scrolling the page and stops on release", async ({ page, context, isMobile }) => {
  test.skip(!isMobile, "Touch input is covered by the mobile project.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projects");
  await expect(page.getByTestId("name-intro")).toBeHidden();
  const pet = page.getByRole("button", { name: "Move Guga" });
  const start = (await pet.boundingBox())!;
  const x = start.x + start.width / 2;
  const y = start.y + start.height / 2;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - 100, y: y - 150 }] });
  await expect(pet).toHaveAttribute("data-animation", "walk-left");
  await expect.poll(async () => (await pet.boundingBox())!.x).toBeCloseTo(start.x - 100, 0);
  await expect.poll(async () => (await pet.boundingBox())!.y).toBeCloseTo(start.y - 150, 0);
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(pet).toHaveAttribute("data-animation", "rest");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await session.detach();
});

test("blocked storage still permits moving, hiding, and restoring the pet", async ({ page }) => {
  await page.addInitScript(() => {
    for (const name of ["getItem", "setItem"]) {
      Object.defineProperty(Storage.prototype, name, {
        value: () => { throw new DOMException("Blocked", "SecurityError"); },
      });
    }
  });
  await page.goto("/projects");
  const pet = page.getByRole("button", { name: "Move Guga" });
  await expect(pet).toBeVisible();
  await pet.focus();
  const before = (await pet.boundingBox())!;
  await page.keyboard.press("ArrowUp");
  await expect.poll(async () => (await pet.boundingBox())!.y).toBeLessThan(before.y);
  await page.keyboard.press("Escape");
  const restore = page.getByRole("button", { name: "Show Guga" });
  await expect(restore).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(pet).toBeFocused();
});
