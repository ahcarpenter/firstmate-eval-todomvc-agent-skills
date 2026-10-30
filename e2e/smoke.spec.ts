import { expect, test } from "@playwright/test";

test("adds a todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});

test("shows how many todos are completed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".completed-count")).toHaveCount(0);
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["Buy milk", "Walk the dog"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const completedCount = page.locator(".completed-count");
  await expect(completedCount).toHaveText("0 of 2 completed");
  await page.locator(".todo-list li .toggle").first().check();
  await expect(completedCount).toHaveText("1 of 2 completed");
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(completedCount).toHaveText("0 of 1 completed");
});

test("shows completion progress as a bar", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".progress")).toHaveCount(0);
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["Buy milk", "Walk the dog", "Read", "Cook", "Sleep"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const bar = page.getByRole("progressbar", { name: "Todos completed" });
  const label = page.locator(".progress-label");
  await expect(bar).toHaveAttribute("aria-valuenow", "0");
  await expect(label).toHaveText("0% complete");
  const toggles = page.locator(".todo-list li .toggle");
  await toggles.nth(0).check();
  await toggles.nth(1).check();
  await expect(bar).toHaveAttribute("aria-valuenow", "40");
  await expect(label).toHaveText("40% complete");
  await page.locator(".toggle-all").check();
  await expect(label).toHaveText("100% complete");
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(page.locator(".progress")).toHaveCount(0);
});
