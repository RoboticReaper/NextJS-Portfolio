import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/{coc,spotify}", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
});

test("the default example follows the navbar logo outline", async ({ page }) => {
  const logo = await readFile("public/logo.svg", "utf8");
  await page.goto("/");
  const source = await page.getByRole("region", { name: "Fourier sketchpad", exact: true }).locator(".fourier-source").getAttribute("d");
  const error = await page.evaluate(({ logo, source }) => {
    const svg = new DOMParser().parseFromString(logo, "image/svg+xml").documentElement;
    svg.setAttribute("style", "position:absolute;visibility:hidden");
    document.body.appendChild(svg);
    const path = svg.querySelector("path") as SVGPathElement;
    const box = path.getBBox();
    const scale = 156 / Math.max(box.width, box.height);
    const values = source!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const count = values.length / 2;
    const errors = Array.from({ length: count }, (_, i) => {
      const point = path.getPointAtLength(path.getTotalLength() * i / count);
      return Math.hypot(values[i * 2] - (point.x - box.x - box.width / 2) * scale, values[i * 2 + 1] - (point.y - box.y - box.height / 2) * scale);
    });
    svg.remove();
    return Math.max(...errors);
  }, { logo, source });
  expect(error).toBeLessThan(0.2);
});

test("example and detail controls work with the keyboard without autoplay", async ({ page }) => {
  await page.goto("/");
  const pad = page.getByRole("region", { name: "Fourier sketchpad", exact: true });
  await expect(pad).toBeVisible({ timeout: 2000 });
  await expect(pad.getByRole("button", { name: "Play animation" })).toBeVisible();
  const path = pad.getByTestId("fourier-path");
  const original = await path.getAttribute("d");
  const slider = pad.getByRole("slider", { name: "Circles" });
  await slider.focus();
  await slider.press("Home");
  await expect(slider).toHaveValue("1");
  await expect(path).not.toHaveAttribute("d", original!);
  await pad.getByRole("button", { name: "Load example" }).focus();
  await page.keyboard.press("Enter");
  await expect(path).toHaveAttribute("d", original!);
  const afterFrames = await path.evaluate(async (element) => {
    for (let i = 0; i < 5; i++) await new Promise(requestAnimationFrame);
    return element.getAttribute("d");
  });
  expect(afterFrames).toBe(original);
});

test("a drawn loop replaces the example and restores without scrolling the page", async ({ page, isMobile }) => {
  await page.goto("/");
  const pad = page.getByRole("region", { name: "Fourier sketchpad", exact: true });
  await expect(pad).toBeVisible({ timeout: 2000 });
  const original = await pad.getByTestId("fourier-path").getAttribute("d");
  await pad.getByRole("button", { name: "Draw a loop" }).click();
  const board = pad.getByRole("img", { name: "Fourier drawing area" });
  await board.scrollIntoViewIfNeeded();
  const box = (await board.boundingBox())!;
  const points = [
    [0.1, 0.04], [0.9, 0.04], [0.9, 0.96], [0.1, 0.96], [0.1, 0.04],
  ].map(([x, y]) => ({ x: box.x + box.width * x, y: box.y + box.height * y }));
  const scrollBefore = await page.evaluate(() => scrollY);
  if (isMobile) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...points[0], id: 1 }] });
    for (const point of points.slice(1))
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ ...point, id: 1 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();
    for (const point of points.slice(1)) await page.mouse.move(point.x, point.y, { steps: 8 });
    await page.mouse.up();
  }
  await expect(pad.getByRole("status", { name: "Drawing status" })).toContainText("Your loop is ready");
  const firstPoint = await pad.locator(".fourier-source").evaluate((element) => {
    const path = element as SVGPathElement;
    const point = path.getPointAtLength(0).matrixTransform(path.getScreenCTM()!);
    return { x: point.x, y: point.y };
  });
  expect(Math.hypot(firstPoint.x - points[0].x, firstPoint.y - points[0].y)).toBeLessThan(1);
  await expect(pad.getByTestId("fourier-path")).not.toHaveAttribute("d", original!);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await page.setViewportSize({ width: 320, height: 800 });
  await expect.poll(() => board.evaluate((element) => {
    const svg = element as SVGSVGElement;
    return Math.abs(svg.viewBox.baseVal.width - 200 * svg.clientWidth / svg.clientHeight);
  })).toBeLessThan(0.1);
  await expect.poll(() => pad.locator(".fourier-source").evaluate((element) => {
    const path = element as SVGPathElement;
    const board = path.ownerSVGElement!.getBoundingClientRect();
    const bounds = path.getBoundingClientRect();
    return bounds.left >= board.left && bounds.right <= board.right && bounds.top >= board.top && bounds.bottom <= board.bottom;
  })).toBe(true);
  await pad.getByRole("button", { name: "Load example" }).click();
  await expect(pad.getByTestId("fourier-path")).toHaveAttribute("d", original!);
});

test("animation plays on request and pauses at a stable curve", async ({ page }) => {
  await page.goto("/");
  const pad = page.getByRole("region", { name: "Fourier sketchpad", exact: true });
  await expect(pad).toBeVisible({ timeout: 2000 });
  await pad.getByRole("button", { name: "Play animation" }).click();
  const path = pad.getByTestId("fourier-path");
  const first = await path.getAttribute("d");
  await expect(path).not.toHaveAttribute("d", first!);
  await pad.getByRole("button", { name: "Pause animation" }).click();
  const paused = await path.getAttribute("d");
  const later = await path.evaluate(async (element) => {
    for (let i = 0; i < 5; i++) await new Promise(requestAnimationFrame);
    return element.getAttribute("d");
  });
  expect(later).toBe(paused);
});

test("rotating circles stop offscreen and resume on returning", async ({ page }) => {
  await page.goto("/");
  const pad = page.getByRole("region", { name: "Fourier sketchpad", exact: true });
  const fullCurve = await pad.getByTestId("fourier-path").getAttribute("d");
  await pad.getByRole("button", { name: "Play animation" }).click();
  const tip = pad.locator(".fourier-tip");
  const starting = await tip.getAttribute("cx");
  await expect(tip).not.toHaveAttribute("cx", starting!);
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  await expect(pad).not.toBeInViewport();
  // Wait until the IntersectionObserver has switched to the complete, static curve.
  await expect(pad.getByTestId("fourier-path")).toHaveAttribute("d", fullCurve!);
  const still = await tip.getAttribute("cx");
  const later = await tip.evaluate(async (element) => {
    for (let i = 0; i < 8; i++) await new Promise(requestAnimationFrame);
    return element.getAttribute("cx");
  });
  expect(later).toBe(still);
  await tip.scrollIntoViewIfNeeded();
  await expect(tip).not.toHaveAttribute("cx", still!);
});
