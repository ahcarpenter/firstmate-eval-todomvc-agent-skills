import { expect, test } from "@playwright/test";

test("shows and keeps a due date across reloads", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 1, 12));
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

test("says today and tomorrow for todos due soon", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 30, 12));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Pay rent", "2026-11-30"],
    ["Call mom", "2026-12-01"],
    ["File taxes", "2026-12-02"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }

  await expect(page.locator(".todo-list li .todo-due")).toHaveText(["Due today", "Due tomorrow", "Due Dec 2"]);
});
