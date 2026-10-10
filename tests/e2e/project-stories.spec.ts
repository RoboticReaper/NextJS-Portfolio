import { expect, test } from "@playwright/test";

test("OtherWise hydrates without invalid HTML or React rendering errors", async ({ page }) => {
  const renderingErrors: string[] = [];
  const isRenderingError = /hydration|hydrating|In HTML|script tag while rendering/i;
  page.on("console", (message) => {
    if (message.type() === "error" && isRenderingError.test(message.text())) {
      renderingErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => renderingErrors.push(error.message));

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/otherwise", { waitUntil: "networkidle" });
  await expect(page.getByRole("complementary", { name: "Research collaboration" })).toBeVisible();
  expect(renderingErrors).toEqual([]);

  // A working client control confirms hydration has completed before checking errors.
  const themeToggle = page.getByRole("button", { name: /Switch to .* mode/ });
  const label = await themeToggle.getAttribute("aria-label");
  await themeToggle.click();
  await expect(themeToggle).not.toHaveAttribute("aria-label", label!);
  expect(renderingErrors).toEqual([]);
});
