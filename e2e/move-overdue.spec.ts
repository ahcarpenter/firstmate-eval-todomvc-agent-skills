import { expect, test } from "@playwright/test";

test("moves every overdue todo to today from the footer", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 30, 12, 0));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const dueDate = page.getByLabel("Due date");
  const move = page.getByRole("button", { name: "Move overdue to today" });

  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(move).toHaveCount(0);

  for (const [title, due] of [
    ["Pay rent", "2026-10-29"],
    ["File taxes", "2026-10-01"],
    ["Call mom", "2026-11-05"],
    ["Renew passport", "2026-09-15"],
  ]) {
    await input.fill(title);
    await dueDate.fill(due);
    await input.press("Enter");
  }

  const items = page.locator(".todo-list li");
  // A completed todo is never overdue, so the button leaves its date alone.
  await items.filter({ hasText: "Renew passport" }).locator(".toggle").check();
  await expect(page.locator(".overdue-count")).toHaveText("2 overdue");

  await move.click();
  await expect(items.locator("label")).toHaveText([
    "Buy milk",
    "Pay rentDue today",
    "File taxesDue today",
    "Call momDue Nov 5",
    "Renew passportDue Sep 15",
  ]);
  await expect(items.locator(".overdue-label")).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveCount(0);
  await expect(move).toHaveCount(0);

  await page.reload();
  await expect(items.filter({ hasText: "Pay rent" })).toContainText("Due today");
  await expect(move).toHaveCount(0);
});
