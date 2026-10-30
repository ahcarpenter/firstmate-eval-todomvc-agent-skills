import { expect, test } from "@playwright/test";

test("snoozes an overdue todo to tomorrow", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 31, 12, 0));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const dueDate = page.getByLabel("Due date");

  for (const [title, due] of [
    ["Pay rent", "2026-10-29"],
    ["Call mom", "2026-10-31"],
  ]) {
    await input.fill(title);
    await dueDate.fill(due);
    await input.press("Enter");
  }

  const items = page.locator(".todo-list li");
  const rent = items.filter({ hasText: "Pay rent" });
  await expect(items.filter({ hasText: "Call mom" }).getByRole("button", { name: "Snooze" })).toHaveCount(0);

  await rent.hover();
  await rent.getByRole("button", { name: "Snooze" }).click();
  await expect(rent.locator(".due-date")).toHaveText("Due Nov 1");
  await expect(rent.locator(".overdue-label")).toHaveCount(0);
  await expect(rent.getByRole("button", { name: "Snooze" })).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveCount(0);

  await page.reload();
  await expect(rent.locator(".due-date")).toHaveText("Due Nov 1");
});
