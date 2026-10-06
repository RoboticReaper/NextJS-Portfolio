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
  await expect(page).toHaveURL(/\/resume#technical-skills$/);
  await expect(page.locator("#technical-skills")).toBeInViewport();
  await expect(page.locator(".technical-skills")).toContainText("Isaac Sim");
});

test("home project previews distinguish project details from the live app", async ({
  page,
}) => {
  for (const project of [
    { name: "OtherWise", path: "/projects/otherwise" },
    { name: "RideList", path: "/projects/ridelist" },
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
      page.getByRole("link", { name: `Open ${project.name}` }),
    ).toHaveAttribute("target", "_blank");
  }
});
