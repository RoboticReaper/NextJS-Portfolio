import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("résumé text can be selected by dragging over the preview", async ({ page }) => {
  await page.goto("/resume");
  const line = page.locator(".resume-text-layer text").filter({
    hasText: "University of Illinois Urbana-Champaign",
  });
  await expect(line).toHaveCount(1);
  await line.scrollIntoViewIfNeeded();
  const box = await line.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + 1, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width - 1, box!.y + box!.height / 2, { steps: 30 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString()))
    .toContain("University of Illinois Urbana-Champaign");
  const copied = await page.locator(".resume-text-layer").evaluate(layer => {
    const range = document.createRange();
    range.selectNodeContents(layer);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    return selection.toString();
  });
  expect(copied).toContain("filter bubbles");
  expect(copied).toContain("offline access");
  expect(copied).toContain("dementia identification");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("résumé PDF links work with pointer and keyboard", async ({ page }) => {
  await page.goto("/resume");
  const document = page.getByRole("region", { name: "Résumé document" });
  const website = document.getByRole("link", { name: "baorenliu.com", exact: true });
  await expect(website).toHaveAttribute("href", "https://baorenliu.com/");
  await expect(document.getByRole("link")).toHaveCount(8);
  await expect(document.getByRole("link", { name: "liubaoren2006@gmail.com", exact: true }))
    .toHaveAttribute("href", "mailto:liubaoren2006@gmail.com");
  // Fulfill locally so link activation never depends on an external website.
  await page.context().route("https://baorenliu.com/", route => route.fulfill({ body: "Linked résumé website" }));
  const pointerPopup = page.waitForEvent("popup");
  await website.click();
  const pointerPage = await pointerPopup;
  await pointerPage.waitForLoadState();
  expect(pointerPage.url()).toBe("https://baorenliu.com/");
  await pointerPage.close();
  await website.focus();
  const keyboardPopup = page.waitForEvent("popup");
  await page.keyboard.press("Enter");
  const keyboardPage = await keyboardPopup;
  await keyboardPage.waitForLoadState();
  expect(keyboardPage.url()).toBe("https://baorenliu.com/");
  await keyboardPage.close();
});
