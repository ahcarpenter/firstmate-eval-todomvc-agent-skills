import { expect, test } from "@playwright/test";

test("shows and keeps a due date across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Due date").fill("2026-11-03");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Pay rent");
  await input.press("Enter");
  await input.fill("Buy milk");
  await input.press("Enter");

  const items = page.locator(".todo-list li");
  await expect(items.nth(0).locator(".todo-due")).toHaveText("Due Nov 3");
  await expect(items.nth(1).locator(".todo-due")).toHaveCount(0);
  await expect(page.getByLabel("Due date")).toHaveValue("");

  await page.reload();
  await expect(items.nth(0).locator(".todo-due")).toHaveText("Due Nov 3");
  await expect(items.nth(1)).toHaveText("Buy milk");
});
