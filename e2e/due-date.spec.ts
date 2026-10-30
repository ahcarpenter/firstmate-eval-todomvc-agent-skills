import { expect, test } from "@playwright/test";

test("adds a todo with an optional due date that survives a reload", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const dueDate = page.getByLabel("Due date");

  await input.fill("Pay rent");
  await dueDate.fill("2026-11-03");
  await input.press("Enter");
  await expect(dueDate).toHaveValue("");

  await input.fill("Buy milk");
  await input.press("Enter");

  const items = page.locator(".todo-list li");
  await expect(items).toHaveText(["Pay rentDue Nov 3", "Buy milk"]);
  await expect(items.nth(1).locator(".due-date")).toHaveCount(0);

  await page.reload();
  await expect(items.nth(0).locator(".due-date")).toHaveText("Due Nov 3");
  await expect(items.nth(1).locator(".due-date")).toHaveCount(0);
});
