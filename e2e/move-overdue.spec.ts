import { expect, test } from "@playwright/test";

test("moves every overdue todo to today and hides the button once none are left", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 5, 12));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Pay rent", "2026-11-01"],
    ["Call mom", "2026-11-04"],
    ["File taxes", "2026-11-03"],
    ["Book flights", "2026-11-10"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");
  await items.filter({ hasText: "File taxes" }).locator(".toggle").check();

  const move = page.getByRole("button", { name: "Move overdue to today" });
  await expect(page.locator(".overdue-count")).toHaveText("2 overdue");
  await move.click();

  await expect(page.locator(".overdue-count")).toHaveText("0 overdue");
  await expect(move).toHaveCount(0);
  await expect(items.locator(".todo-due")).toHaveText(["Due today", "Due today", "Due Nov 3", "Due Nov 10"]);

  await page.reload();
  await expect(items.locator(".todo-due")).toHaveText(["Due today", "Due today", "Due Nov 3", "Due Nov 10"]);
  await expect(move).toHaveCount(0);
});
